import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import Posts from "./routes/Posts";
import Layout from "./layout";

export default createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/posts',
                element: <Posts />
            }
        ]
    }
])