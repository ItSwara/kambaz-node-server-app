import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import EnrollmentModel from "../Enrollments/model.js";

export function findAllCourses() {
  return model.find()
}

export function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = Database;
    const enrolledCourses = courses.filter((course) =>
      enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
    return enrolledCourses;
  }
  
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
      
  
  