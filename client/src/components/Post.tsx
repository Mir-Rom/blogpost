type PostProps = {
    title: string,
    image?: string,
    text?: string,
    tags?: string[] | string
}

export default function Post({title, image, text}: PostProps) {
    return <section className="post">
        <img src={image} alt="" />
        <h1>{title}</h1>
        <p>{text ? text.substring(1, 30) + '...' : ''}</p>
        {/* <ul className="tags">
            { tags ? tags.map(tag => <li>{tag}</li>) : '' }
        </ul> */}
    </section>
}