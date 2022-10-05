import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navigation from "./Components/Navigation/Navigation";
import Index from "./Pages/Index";
import Signin from "./Pages/Signin";
import Signout from "./Pages/Signout";
import Signup from "./Pages/Signup";
import "antd/dist/antd.min.css"
import { useEffect } from "react";
import { useAppDispatch } from "./Stores/Hooks";
import axios from "axios";
import { intialize } from "./Stores/CredentialSlice";

function App() {

  // const state = useAppState(state => state.credentials)
  const dispatch = useAppDispatch()
  useEffect(() => {
    axios.get("/api/user/")
      .then(response => {
        
        dispatch(intialize(response.data))
      })
      .catch(err => {

      })
  }, [dispatch])



  return (
    <div className="tw-w-full tw-absolute tw-h-full tw-overflow-hidden">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Index />} />
          <Route path="/signout" element={<Signout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
