import Database from "../Database/index.js";
import moduleModel from "./model.js"; 
import { v4 as uuidv4 } from "uuid";
export function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    // Database.modules = [...Database.modules, newModule];
    // return newModule;
    return moduleModel.create(newModule);

  }
  
 // In your dao.js file, update the findModulesForCourse function:
// export async function findModulesForCourse(courseId) {
//   try {
//     const modules = await moduleModel.find({ course: courseId }).lean().exec();
    
//     // Ensure each module has an _id
//     return modules.map(module => {
//       // If _id is missing, use MongoDB's _id or generate a new one
//       if (!module._id) {
//         const id = module._id?.toString() || uuidv4();
//         return { ...module, _id: id };
//       }
//       return module;
//     });
//   } catch (error) {
//     console.error("Error in findModulesForCourse:", error);
//     return [];
//   }
// }

// export function findModulesForCourse(courseId) {
//   return moduleModel.find({ course: courseId });
// }

export async function findModulesForCourse(courseId) {
  try {
    console.log("Finding modules for course:", courseId);
    const modules = await moduleModel.find({ course: courseId }).lean().exec();
    console.log(`Found ${modules.length} modules for course ${courseId}`);
    console.log(modules)
    return modules;
  } catch (error) {
    console.error("Error finding modules for course:", error);
    throw error;
  }
}

export function deleteModule(moduleId) {
  return moduleModel.deleteOne({ _id: moduleId });
    // const { modules } = Database;
    // Database.modules = modules.filter((module) => module._id !== moduleId);
   }



   // In your server-side module DAO
export async function updateModule(moduleId, moduleUpdates) {
  try {
    console.log("Updating module with ID:", moduleId);
    console.log("Update data:", moduleUpdates);

    // Make sure the ID is a string if you're using string IDs
    const updatedModule = await moduleModel.findByIdAndUpdate(
      moduleId,
      moduleUpdates,
      { 
        new: true,  // Return updated document
        upsert: false  // Don't create if it doesn't exist
      }
    ).lean();
    
    console.log("Updated module result:", updatedModule);
    
    // If module not found, handle it properly
    if (!updatedModule) {
      console.error("Module not found with ID:", moduleId);
      return null;
    }
    
    return updatedModule;
  } catch (error) {
    console.error("Error updating module:", error);
    throw error;
  }
}
// working for exsisting modules
// export async function updateModule(moduleId, moduleUpdates) {
//   try {
//     // Use the { new: true } option to return the updated document
//     const updatedModule = await moduleModel.findByIdAndUpdate(
//       moduleId,
//       moduleUpdates,
//       { new: true }  // This is the key - return the updated document
//     ).lean();
    
//     return updatedModule; // Return the actual updated document
//   } catch (error) {
//     console.error("Error updating module:", error);
//     throw error;
//   }
// }
  
   
