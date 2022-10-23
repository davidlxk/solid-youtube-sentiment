import { Component, createSignal,Switch, Match, For, onMount, createEffect } from 'solid-js';
import fetchVideoComments from '../../fetches/fetchVideoComments';
import { YouTubeVideoComment } from '../../types/DataTypes';
import Comment from '../../components/comment/Comment';
import * as tf from "@tensorflow/tfjs";
import Loader from '../../components/loader/Loader';
import Header from '../../components/header/Header';
import Store from '../../store/Store';
import ErrorMessage from '../../components/error/ErrorMessage';

interface HomeScreenProps {

    
}

const urls = {
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
  
}

const HomeScreen: Component<HomeScreenProps> = (props:HomeScreenProps) => {

    const query = fetchVideoComments({});

    const [store, setStore] = Store;
    const [model, setModel] = createSignal<any>();
    const [metaData, setMetaData] = createSignal<any>();
    const [finalPercent, setFinalPercent] = createSignal<number>(0);

    async function loadModel() {
        try {

            const model = await tf.loadLayersModel(urls.model);
            setModel(model);

            console.log("MODEL HAS LOADED");

        } catch (err) {
            console.log(err);
        }
    }

    async function loadMetadata() {
        try {

            const metadataJson = await fetch(urls.metadata);
            const metadata = await metadataJson.json();
            setMetaData(metadata);
            
        } catch (err) {
            console.log(err);
        }
    }

    let timerID: any;
    const formatURL = (url: string) => {
    
        let isValidated = false;

        if (url.indexOf("?v=")!=-1) {

            const formatted = url.split("?v=");
            const videoID = formatted[1];
            setStore("videoId", v=> videoID);
            isValidated = true;
        }

        clearTimeout(timerID);

        if (isValidated) {
            timerID = setTimeout(()=>{
                query.refetch();
            },1000);
        }
    }

    createEffect(()=>{

        if (query.isSuccess && model()) {

            let total = store.sentiments.length;
            let positive = 0;
            let negative = 0;
            let neutral = 0;
            store.sentiments.forEach(sentiment => {
                
                if (sentiment == "Positive") { positive++; }
                else if (sentiment == "Negative") { negative++; }
                else { neutral++; }
            });
            
            const finalPercent = (positive / total) * 100;
            setFinalPercent(finalPercent);
        }
    })

    const rounded = () => Math.round(finalPercent() * 100) / 100;

    const overallImageURL = () =>
        rounded() > 80 ? "/assets/images/happy.png" :
        rounded() > 50 ? "/assets/images/neutral.png" :
        "/assets/images/sad.png";

    onMount(()=>{
        loadModel();
        loadMetadata();
    })
    
    return(
        <div class="px-10">
            <Header formatURL={formatURL}/>
            <div class=" flex flex-col pt-20">
            
                <Switch>
                    <Match when={query.isFetching}>
                        <Loader />
                    </Match>
                    <Match when={query.isError}>
                        <ErrorMessage 
                            errorMessage="There was an error retrieving this video's comments"
                        />
                    </Match>
                    <Match when={query.isSuccess && model()}>
                        <div class="flex flex-col">

                            <div class="flex flex-row pt-5 pl-5 pb-5 mt-5 bg-blue-50 rounded">
                                <img src={overallImageURL()} class="w-16 h-16 rounded-full"/>
                                <p class="pl-4 pt-4">{rounded() + "% Positive Overall"}</p>
                            </div>
                        
                            <For each={query.data.items}>
                                {
                                (item: YouTubeVideoComment,index) => <Comment
                                    model={model()}
                                    metaData={metaData()}
                                    author={item.snippet.topLevelComment.snippet.authorDisplayName}
                                    text={item.snippet.topLevelComment.snippet.textOriginal}
                                    date={item.snippet.topLevelComment.snippet.updatedAt}
                                />
                                }
                            </For>
                        </div>
                    </Match>
                </Switch>
            </div>
        </div>
    );

};

export default HomeScreen;