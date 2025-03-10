import { Link } from "react-router";

function NotFound(){
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go back to the Dashboard</Link>
        </div>
    )
}

export default NotFound;