import mongoose from "mongoose";
import assignmentSchema from "./schema.js"; // Update with correct path

// Create the Assignment model
const Assignment = mongoose.model("Assignment", assignmentSchema);

export async function createAssignment(assignment) {
  const newAssignment = new Assignment({ 
    ...assignment, 
    _id: assignment._id || new mongoose.Types.ObjectId().toString(),
    points: assignment.points || 100,
    available: assignment.available || new Date(),
    due: assignment.due || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  await newAssignment.save();
  return newAssignment;
}

export async function findAssignmentsForCourse(courseId) {
  return await Assignment.find({ course: courseId });
}

export async function findAssignmentById(assignmentId) {
  return await Assignment.findById(assignmentId);
}

export async function updateAssignment(assignmentId, assignmentUpdates) {
  const updatedAssignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    assignmentUpdates,
    { new: true } // Returns the updated document
  );
  
  return updatedAssignment;
}

export async function deleteAssignment(assignmentId) {
  await Assignment.findByIdAndDelete(assignmentId);
  return { status: "ok" };
}






// import Database from "../Database/index.js";
// import { v4 as uuidv4 } from "uuid";
// import model from "./model.js"

// export function createAssignment(assignment) {
//   const newAssignment = { 
//     ...assignment, 
//     _id: uuidv4(),
//     points: assignment.points || 100,
//     available_from_date: assignment.available_from_date || new Date().toISOString(),
//     due_date: assignment.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
//   };
//   Database.assignments = [...Database.assignments, newAssignment];
//   return newAssignment;
// }

// export function findAssignmentsForCourse(courseId) {
//   const { assignments } = Database;
//   return assignments.filter((assignment) => assignment.course === courseId);
// }

// export function findAssignmentById(assignmentId) {
//   const { assignments } = Database;
//   return assignments.find((assignment) => assignment._id === assignmentId);
// }

// export function updateAssignment(assignmentId, assignmentUpdates) {
//   const { assignments } = Database;
//   const assignmentIndex = assignments.findIndex((assignment) => assignment._id === assignmentId);
  
//   if (assignmentIndex === -1) {
//     return null;
//   }
  
//   Database.assignments[assignmentIndex] = { 
//     ...Database.assignments[assignmentIndex], 
//     ...assignmentUpdates 
//   };
  
//   return Database.assignments[assignmentIndex];
// }

// export function deleteAssignment(assignmentId) {
//   const { assignments } = Database;
//   Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
//   return { status: "ok" };
// }