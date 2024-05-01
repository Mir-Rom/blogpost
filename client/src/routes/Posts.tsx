import Post from "../components/Post";
import useSWR from "swr";
import fetcher from "../fetcher";

export default function Posts() {
    const { data, error, isLoading } = useSWR('/api/posts', fetcher)

    if(error) {
        return <h1>Error!!!</h1>
    }

    if(isLoading) {
        return <h1>Loading...</h1>
    }

    if(data.code !== 0) {
        return <h1>Error...</h1>
    }

    return <div>
        <div className="posts-grid">
            {
                data.data.map(post => <Post title={post.title} text={post.text} tags={post.tags} image={post.image} />)
            }
        </div>
    </div>
}