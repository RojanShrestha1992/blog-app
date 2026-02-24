import React, { useEffect, useState } from "react";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../api/api";

const Home = () => {
    const [loggedInUserId, setLoggedInUserId] = useState(null)
  const [refresh, setRefresh] = useState(false);
  const [currentView, setCurrentView] = useState("all");
  const [showModal, setShowModal] = useState(false);



  useEffect(()=>{
    const fetchUser = async () => {
        const user = await getCurrentUser();
        if(user){
            setLoggedInUserId(user._id)
        }
    }
    fetchUser()
  }, [])

  const handleNavClick = (view) => {
    if (view === "create") {
      setShowModal(true);
    } else {
      setCurrentView(view);
    }
  };
  const closeModal = () => setShowModal(false);
  console.log("loggedInUserId in home", loggedInUserId)
  return (
    <div>
      <Navbar onNavClick={handleNavClick} />

      {/* modal for creating post */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ×
            </button>
            <PostForm
              onPostCreated={() => {
                // closeModal();
                setShowModal(false);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      )}

      {/* <PostForm onPostCreated={()=> setRefresh(!refresh)}/> */}

      {/* Views */}
      {currentView === "all" && (
        <PostList key={refresh + "-all"} currentUserId={loggedInUserId} filterByUser={null} />
      )}
      {currentView === "profile" && (
        <PostList
          key={refresh + "-profile"}
          currentUserId={loggedInUserId}
          filterByUser={loggedInUserId}
        />
      )}

      {/* <PostList key={refresh}/> */}
    </div>
  );
};

export default Home;
