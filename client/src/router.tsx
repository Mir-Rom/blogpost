import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";

export default createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <h1>Main Page</h1>
            },
            {
                path: '/posts',
                element: <h1>Posts</h1>
            }
        ]
    }
])