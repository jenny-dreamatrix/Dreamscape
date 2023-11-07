import './LoadingPage.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoadingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const timer = setTimeout(() => {
        navigate("/signup");
      }, 3000);
  
      return () => clearTimeout(timer);
    }, []);

    return ( 
        <>
        <h1>Loading Page</h1>
        </>
     );
}
 
export default LoadingPage;