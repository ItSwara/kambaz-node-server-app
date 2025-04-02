import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
export function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    Database.modules = [...Database.modules, newModule];
    return newModule;
  }
  
export function findModulesForCourse(courseId) {
  const { modules } = Database;
  return modules.filter((module) => module.course === courseId);
}

export function deleteModule(moduleId) {
    const { modules } = Database;
    Database.modules = modules.filter((module) => module._id !== moduleId);
   }

export function updateModule(moduleId, moduleUpdates) {
    const { modules } = Database;
    const moduleIndex = modules.find((module) => module._id === moduleId);
    Database.modules[moduleIndex] = { 
        ...Database.modules[moduleIndex], 
        ...moduleUpdates 
    };
    console.log("Updating module with ID:", moduleId);
console.log("Current modules:", Database.modules);
console.log("Module index found:", moduleIndex);

    return Database.modules[moduleIndex];
  }
  
   
