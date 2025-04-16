import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import EnrollmentModel from "../Enrollments/model.js";

export function findAllCourses() {
  return model.find()
}

export async function findCoursesForEnrolledUser(userId) {
  try {
    // Find all enrollments for this user with status "ENROLLED"
    const enrollments = await EnrollmentModel.find({
      user: userId,
      status: "ENROLLED"
    }).populate("course");
    
    console.log(`Found ${enrollments.length} enrollments for user ${userId}`);
    
    // Extract the course objects from the populated enrollments
    const enrolledCourses = enrollments.map(enrollment => enrollment.course);
    return enrolledCourses;
  } catch (error) {
    console.error(`Error finding enrollments for user ${userId}:`, error);
    throw error;
  }
}
// export function findCoursesForEnrolledUser(userId) {
//     const { courses, enrollments } = Database;
//     const enrolledCourses = courses.filter((course) =>
//       enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
//     console.log(`Found ${enrollments.length} enrollments for user ${userId}`);
//     return enrolledCourses;
//   }

// Add this function to enrollment/dao.js
// export async function findCoursesForEnrolledUser(userId) {
//   try {
//     // Find all enrollments for this user with status "ENROLLED"
//     const enrollments = await model.find({ 
//       user: userId,
//       status: "ENROLLED"
//     });
    
//     console.log(`Found ${enrollments.length} enrollments for user ${userId}`);
//     return enrollments;
//   } catch (error) {
//     console.error(`Error finding enrollments for user ${userId}:`, error);
//     throw error;
//   }
// }
  
  export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    // Database.courses = [...Database.courses, newCourse];
    // return newCourse;
    return model.create(newCourse);
  }

  export function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });;}

  export function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }
      
  
  