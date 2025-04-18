import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      console.log("Fetching courses from database:", courses.length);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  // Enroll a user in a course
  app.post("/api/courses/:cid/enroll", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    
    try {
      const { cid } = req.params;
      
      // Check if already enrolled - you can implement this check if needed
      
      // Create enrollment
      const enrollment = await dao.enrollUserInCourse(currentUser._id, cid);
      
      console.log(`User ${currentUser._id} enrolled in course ${cid}`);
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      
      // Handle duplicate key error (already enrolled)
      if (error.code === 11000) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      res.status(500).json({ message: "Error enrolling in course" });
    }
  });

  // Unenroll a user from a course
  app.delete("/api/courses/:cid/enroll", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    
    try {
      const { cid } = req.params;
      
      // Unenroll the user
      const result = await dao.unenrollUserFromCourse(currentUser._id, cid);
      
      console.log(`User ${currentUser._id} unenrolled from course ${cid}. Removed ${result.deletedCount} enrollments.`);
      res.json({ 
        message: "Successfully unenrolled",
        userId: currentUser._id,
        courseId: cid
      });
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      res.status(500).json({ message: "Error unenrolling from course" });
    }
  });

  // Get all enrollments for a specific user
  app.get("/api/users/:uid/enrollments", async (req, res) => {
    try {
      const { uid } = req.params;
      const enrollments = await dao.findEnrollmentsForUser(uid);
      console.log(`Fetching enrollments for user ${uid}: Found ${enrollments.length}`);
      res.json(enrollments);
    } catch (error) {
      console.error(`Error fetching enrollments for user:`, error);
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });
  
  // Get all enrollments (for admin/debug)
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await dao.findAllEnrollments();
      console.log(`Fetching all enrollments: Found ${enrollments.length}`);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching all enrollments:", error);
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });
  
  // Find courses for a user
  app.get("/api/users/:uid/courses", async (req, res) => {
    try {
      const { uid } = req.params;
      const courses = await dao.findCoursesForUser(uid);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses for user:", error);
      res.status(500).json({ message: "Error fetching courses for user" });
    }
  });
  
  // Find users for a course
  app.get("/api/courses/:cid/users", async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await dao.findUsersForCourse(cid);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users for course:", error);
      res.status(500).json({ message: "Error fetching users for course" });
    }
  });
}

// import model  from "./model.js";
// import Database from "../Database/index.js";
// import { v4 as uuidv4 } from "uuid";

// export default function EnrollmentRoutes(app) {
    
//     // Get all courses
//     app.get("/api/courses", (req, res) => {
//         const { courses } = Database;
//         console.log("Fetching courses from database:", courses.length);
//         res.json(courses);
//     });

//     // Enroll a user in a course
//     app.post("/api/courses/:cid/enroll", (req, res) => {
//         const currentUser = req.session["currentUser"];
//         if (!currentUser) {
//             res.status(401).json({ message: "Not logged in" });
//             return;
//         }
        
//         const { cid } = req.params;
//         const enrollment = {
//             _id: uuidv4(),
//             user: currentUser._id,
//             course: cid
//         };
        
//         // Check if already enrolled
//         const alreadyEnrolled = Database.enrollments.some(
//             e => e.user === currentUser._id && e.course === cid
//         );
        
//         if (alreadyEnrolled) {
//             res.status(400).json({ message: "Already enrolled in this course" });
//             return;
//         }
        
//         Database.enrollments.push(enrollment);
//         console.log(`User ${currentUser._id} enrolled in course ${cid}`);
//         res.json(enrollment);
//     });

//     // Unenroll a user from a course
//     app.delete("/api/courses/:cid/enroll", (req, res) => {
//         const currentUser = req.session["currentUser"];
//         if (!currentUser) {
//             res.status(401).json({ message: "Not logged in" });
//             return;
//         }
        
//         const { cid } = req.params;
        
//         // Count enrollments before filtering
//         const beforeCount = Database.enrollments.length;
        
//         Database.enrollments = Database.enrollments.filter(
//             e => !(e.user === currentUser._id && e.course === cid)
//         );
        
//         // Count enrollments after filtering
//         const afterCount = Database.enrollments.length;
        
//         console.log(`User ${currentUser._id} unenrolled from course ${cid}. Removed ${beforeCount - afterCount} enrollments.`);
//         res.json({ 
//             message: "Successfully unenrolled",
//             userId: currentUser._id,
//             courseId: cid
//         });
//     });

//     // Get all enrollments for a specific user
//     app.get("/api/users/:uid/enrollments", (req, res) => {
//         const { uid } = req.params;
//         const enrollments = Database.enrollments.filter(
//             enrollment => enrollment.user === uid
//         );
//         console.log(`Fetching enrollments for user ${uid}: Found ${enrollments.length}`);
//         res.json(enrollments);
//     });
    
//     // Get all enrollments (for admin/debug)
//     app.get("/api/enrollments", (req, res) => {
//         console.log(`Fetching all enrollments: Found ${Database.enrollments.length}`);
//         res.json(Database.enrollments);
//     });
    
//     // Add new enrollment (alternative endpoint for testing)
//     app.post("/api/enrollments", (req, res) => {
//         const { userId, courseId } = req.body;
        
//         if (!userId || !courseId) {
//             res.status(400).json({ message: "Missing required fields: userId and courseId" });
//             return;
//         }
        
//         const enrollment = {
//             _id: uuidv4(),
//             user: userId,
//             course: courseId
//         };
        
//         // Check if already enrolled
//         const alreadyEnrolled = Database.enrollments.some(
//             e => e.user === userId && e.course === courseId
//         );
        
//         if (alreadyEnrolled) {
//             res.status(400).json({ message: "Already enrolled in this course" });
//             return;
//         }
        
//         Database.enrollments.push(enrollment);
//         console.log(`User ${userId} enrolled in course ${courseId} (via /api/enrollments)`);
//         res.json(enrollment);
//     });
// }