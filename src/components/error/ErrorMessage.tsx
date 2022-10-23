import { Component, createSignal } from 'solid-js';

interface ErrorMessageProps {

    errorMessage: string;
}

const ErrorMessage: Component<ErrorMessageProps> = (props:ErrorMessageProps) => {

    return(

        <div class="flex flex-col h-20 pt-10 text-gray-500">
            <div>{props.errorMessage}</div>
            <div class="pb-4 -mt-1">It's a sad day indeed</div>
            <img src={"/assets/images/sadInRain.png"} class=" rounded-xl"/>
        </div>
    );

};

export default ErrorMessage;