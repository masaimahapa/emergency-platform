import React from "react";
import Navbar from "@/components/navbar";
function Layout({children}: {children: React.ReactNode}){
    

    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}

export default Layout;