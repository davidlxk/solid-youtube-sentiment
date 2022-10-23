import { createStore } from 'solid-js/store';

interface SolidStore {

    videoId:string;
    sentiments: string[];
}

const Store = createStore<SolidStore>({

    videoId: "l98w9OSKVNA",
    sentiments: []
});

export default Store;