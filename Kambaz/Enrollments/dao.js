import model from "./model.js";

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ 
    user: userId,
    status: "ENROLLED" // Only return active enrollments
  }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ 
    course: courseId,
    status: "ENROLLED" // Only return active enrollments
  }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

export function enrollUserInCourse(user, course) {
  const newEnrollment = { 
    user, 
    course, 
    _id: `${user}-${course}`,
    enrollmentDate: new Date(),
    status: "ENROLLED"
  };
  return model.create(newEnrollment);
}


export function unenrollUserFromCourse(user, course) {
  // Option 1: Remove the enrollment record completely
  return model.deleteOne({ user, course });
  
  // Option 2: Mark the enrollment as DROPPED (preserves enrollment history)
  // return model.updateOne(
  //   { user, course }, 
  //   { $set: { status: "DROPPED" } }
  // );
}


// import Database from "../Database/index.js";
// import { v4 as uuidv4 } from "uuid";


// // export function enrollUserInCourse(userId, courseId) {
// //   const { enrollments } = Database;
// //   enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
// // }


// import model from "./model.js";

export const findAllEnrollments = async () => {
  return await model.find();
};

// export async function findCoursesForUser(userId) {
//  const enrollments = await model.find({ user: userId }).populate("course").lean().exec();
//  return enrollments.map((enrollment) => enrollment.course);
// }
// export async function findUsersForCourse(courseId) {
//  const enrollments = await model.find({ course: courseId }).populate("user");
//  return enrollments.map((enrollment) => enrollment.user);
// }
// export function enrollUserInCourse(user, course) {
//  return model.create({ user, course, _id: `${user}-${course}` });
// }
// export function unenrollUserFromCourse(user, course) {
//  return model.deleteOne({ user, course });
// }
// export async function findCoursesForEnrolledUser(userId) {
//   // const { courses, enrollments } = Database;
//   // const enrolledCourses = courses.filter((course) =>
//   //   enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
//   // return enrolledCourses;
//   return await model.find({ user: userId });
// }
