import { Component, createSignal } from 'solid-js';

interface HeaderProps {

    formatURL: (value: string) => void;
}

const Header: Component<HeaderProps> = (props:HeaderProps) => {

    return(
        <div class="h-20 bg-white flex flex-row fixed top-0 border-b border-blue-100">
            <input type="text" class="w-screen h-10 mt-8 text-2xl outline-none transform transition-all duration-700 ease-in-out focus:pl-5"
                placeholder='Enter/Paste a youtube link here'
                oninput={(e)=>props.formatURL(e.currentTarget.value)}
            />
        </div>
    );

};

export default Header;