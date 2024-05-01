import { Link, Outlet } from "react-router-dom"

export default function() {
    return <div>
        <header className="header">
            <h1>BlogPost</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/posts">Posts</Link>
            </nav>
        </header>
        <Outlet />
    </div>
}