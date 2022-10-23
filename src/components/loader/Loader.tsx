import { Component, createSignal } from 'solid-js';
import { spring } from "motion";
import { Motion } from "@motionone/solid";

interface LoaderProps {

    
}

const Loader: Component<LoaderProps> = (props:LoaderProps) => {

    return(
    <div class="w-screen h-screen -ml-10 pt-60 items-center flex flex-col">

        <Motion.div 
            class="h-10 w-10 bg-blue-500"
            animate={{
                rotate:90,
                animationDuration:500
            }}
            transition={{
                easing: spring(),
                repeat: Infinity
            }}
        />
    </div>);

};

export default Loader;