import { Component, createSignal } from 'solid-js';
import dayjs from "dayjs";
import * as tf from "@tensorflow/tfjs";
import Store from '../../store/Store';

interface CommentProps {

    author: string;
    text: string;
    date: string;
    metaData: any;
    model: any;
}

const SentimentThreshold = {
    Positive: 0.66,
    Neutral: 0.33,
    Negative: 0
}

const sentimentToImage: any = {
    "Positive":"/assets/images/happy.png",
    "Neutral":"/assets/images/neutral.png",
    "Negative":"/assets/images/sad.png"
}


const Comment: Component<CommentProps> = (props:CommentProps) => {

    const [sentiment, setSentiment] = createSignal<string>("");

    const [store, setStore] = Store;

    function processText(text: string) {

        const sentimentScore = getSentimentScore(text);
        let sentimentWord = '';

        if (sentimentScore > SentimentThreshold.Positive) {
            sentimentWord = 'Positive';
        } else if (sentimentScore > SentimentThreshold.Neutral) {
            sentimentWord = 'Neutral';
        } else if (sentimentScore >= SentimentThreshold.Negative) {
            sentimentWord = 'Negative';
        }

        setSentiment(sentimentWord);

        setStore('sentiments', s => [...s,sentimentWord]);

        return sentimentWord;
    }

    function getSentimentScore(text: string) {

        const trimmed = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');

        const inputBuffer = tf.buffer([1,props.metaData.max_len],"float32");
    
        trimmed.forEach((word,i)=> inputBuffer.set(props.metaData.word_index[word] + props.metaData.index_from,0,i));
    
        const input = inputBuffer.toTensor();

        const predictOut = props.model.predict(input);
        const score = predictOut.dataSync()[0];
        predictOut.dispose();

        return score;
    }

    return(
        <div class="bg-white border-blue-400 border-opacity-10 border-b pt-7 pb-5 flex flex-col">
            <div class="flex flex-row">
                <div class="text-left font-medium">{props.author}</div>
                <div class="text-gray-400 text-xs pl-2 pt-1">{dayjs(props.date).format('DD/MM/YYYY h:mm A')}</div>
            </div>
            <div class="text-left font-light text-sm pt-2">{props.text}</div>
            <div class="flex flex-row pt-2">
                <img src={sentimentToImage[sentiment()]} class="w-8 h-8 rounded-full"/>
                <div class="pt-2 pl-2 text-xs text-blue-800">{processText(props.text)}</div>
            </div>
        </div>
    );

};

export default Comment;