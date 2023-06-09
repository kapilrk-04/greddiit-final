import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        if(localStorage.getItem("loading") === "false")
        {
            navigate(-1);
        }
    }, [])
    
    return (
        <div>
        <h1>Loading....</h1>
        </div>
    );
}

export default Home;