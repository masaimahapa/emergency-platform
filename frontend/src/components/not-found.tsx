import { Link } from "react-router";

function NotFound(){
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
                <Link 
                    to="/" 
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                    Go back to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default NotFound;