import { Link, Outlet } from "react-router-dom"

export default function() {
    return <div>
        <h1>BlogPost</h1>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
        <Outlet />
    </div>
}