import { useContext, useState } from "react";
import { ProjectsContext } from "../contexts/ProjectsProvider";


import LoggeInRequired from "../components/logginRequired";
import { Link } from "react-router-dom";
import axios from "axios";



const MyProjects = () => {

    const {user } = useContext(ProjectsContext);

    if(!user){
        return(
          <LoggeInRequired />
        )
    }
    const {projects } = useContext(ProjectsContext);
    const myProjects = projects.filter((project) => project.createdBy === user._id);
    
    return(
        <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      {
      myProjects.length === 0 ? (
        <p className="text-gray-600">You have not created any projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
          myProjects.map((project, index) => (
           <LocalProjectCard project={project} user={user}/>
          ))}
        </div>
      )}
    </div>
  )
}

function LocalProjectCard({project, user}){
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const collectedPercentage = (project.collectedAmount / project.neededAmount) * 100;
  
  const handleDeleteProject = async () =>{
    console.log("Delete function fired");
    try {
      await axios.delete(`http://localhost:5200/api/projects/${project._id}`)
      location.reload();
    } catch (error) {
      console.log("Error Deleting Project: ", error);
    }
   
  }
  
  return(
    <div className="bg-white w-[300px] md:w-[400px] rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">

      <div className="relative h-[250px] w-full">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="mx-auto w-full h-full object-cover object-center transition-opacity duration-300"

        />
        <Link
          to={`/project/${project._id}`}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          View Details
        </Link>
      </div>

      <div className="w-full h-[200px] p-4 flex flex-col">

        <div className="mb-4">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">{project.title}</h2>
          <h2 className="text-sm text-slate-500 font-semibold">{project._id}</h2>
          {/* <p className="text-gray-600 h-[60px] overflow-hidden line-clamp-3">
            {project.projectDetails.description}
          </p> */}
        </div>

        <div className="flex justify-between gap-4 items-center mb-4">
          <p className="text-green-800 font-semibold">
            Collected: PKR {project.collectedAmount}
          </p>
          <p className="text-red-700 font-semibold">
            Required: PKR {project.neededAmount}
          </p>
        </div>

        <div className="relative h-4 w-full bg-gray-200 rounded-full mb-4">
          <div
            className="absolute top-0 left-0 h-4 bg-green-500 rounded-full"
            style={{ width: `${collectedPercentage}%` }}
          ></div>
        </div>

        {
          !showConfirmDelete && user && project?.createdBy && project.createdBy === user._id &&
          <button onClick={()=>{setShowConfirmDelete(true)}} className='bg-red-600 ml-auto text-white px-5 py-2  rounded-md hover:scale-105'>
            Delete
          </button>
        }
        {
          showConfirmDelete &&
          <div className='flex items-center'>
            <div className="text-red-600 font-bold">Confirm Delete</div>
           <button onClick={()=>{handleDeleteProject()}} className='text-red-500 border border-red-500 ml-auto px-5 py-2  rounded-md hover:scale-105 hover:bg-red-500 hover:text-white'>Delete</button>
           <button onClick={()=>{setShowConfirmDelete(false)}} className='bg-green-600 ml-auto text-white px-5 py-2  rounded-md hover:scale-105'>Cancel</button>
          </div>
        }

      </div>

    </div>
  )
}

export default MyProjects;