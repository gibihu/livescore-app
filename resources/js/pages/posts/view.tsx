import { usePage } from "@inertiajs/react";


export default function PostView() {
    const id = usePage().props.id as string;
    return(
        <>
        {id}
        </>
    );
}
