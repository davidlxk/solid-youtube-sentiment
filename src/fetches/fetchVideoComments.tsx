import { Component, createSignal } from 'solid-js';
import { createQuery } from '@tanstack/solid-query'
import { GetVideoCommentsRequest, GetVideoCommentsResponse } from '../types/DataTypes';
import Store from '../store/Store';

const ENDPOINTS = {
    GET_VIDEO_COMMENTS: `https://youtube.googleapis.com/youtube/v3/commentThreads`
}

interface fetchVideoCommentsProps {
}

const fetchVideoComments = (props:fetchVideoCommentsProps) => {

    const [store, setStore] = Store;

    const request: GetVideoCommentsRequest = {
        part: "snippet",
        key:import.meta.env.VITE_YOUTUBE_DATA_KEY,
        videoId:store.videoId
    };

    const query = createQuery<GetVideoCommentsResponse | any>(
        ()=> ['comments'],
        async () => {
            return fetch(`${ENDPOINTS.GET_VIDEO_COMMENTS}?key=${request.key}&part=${request.part}&videoId=${store.videoId}`)
                .then(res => {
                    if (res.status == 200) { return res.json() }
                    else if (res.status == 404) { throw new Error("ERROR")}
                })
                .catch(error=>{
                    throw new Error(error);
                });
        }, {
            get refetchOnWindowFocus() {
                return false;
            }
        }
    )

    return query;

};

export default fetchVideoComments;