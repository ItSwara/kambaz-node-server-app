// import Database from "../Database/index.js";

// export default function EnrollmentRoutes(app) {
    
//     app.get("/api/courses", (req, res) => {
//         const { courses } = Database;
//         console.log("Fetching courses from database:", Database.courses);
//         res.json(courses);
//     });

//     app.post("/api/courses/:cid/enroll", (req, res) => {
//         console.log("Current user session:", req.session["currentUser"]);
//         const currentUser = req.session["currentUser"];
//         if (!currentUser) {
//             res.status(401).json({ message: "Not logged in" });
//             return;
//         }
//         const { cid } = req.params;
//         const enrollment = {
//             _id: new Date().getTime().toString(),
//             user: currentUser._id,
//             course: cid
//         };
//         Database.enrollments.push(enrollment);
//         res.json(enrollment);
//     });

//     app.delete("/api/courses/:cid/enroll", (req, res) => {
//         const currentUser = req.session["currentUser"];
//         if (!currentUser) {
//             res.status(401).json({ message: "Not logged in" });
//             return;
//         }
//         const { cid } = req.params;
//         Database.enrollments = Database.enrollments.filter(
//             e => !(e.user === currentUser._id && e.course === cid)
//         );
//         res.json({ message: "Successfully unenrolled" });
//     });

//     app.get("/api/users/:uid/enrollments", (req, res) => {
//         const { uid } = req.params;
//         const enrollments = Database.enrollments.filter(
//             enrollment => enrollment.user === uid
//         );
//         res.json(enrollments);
//     });
// }



import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export default function EnrollmentRoutes(app) {
    
    // Get all courses
    app.get("/api/courses", (req, res) => {
        const { courses } = Database;
        console.log("Fetching courses from database:", courses.length);
        res.json(courses);
    });

    // Enroll a user in a course
    app.post("/api/courses/:cid/enroll", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }
        
        const { cid } = req.params;
        const enrollment = {
            _id: uuidv4(),
            user: currentUser._id,
            course: cid
        };
        
        // Check if already enrolled
        const alreadyEnrolled = Database.enrollments.some(
            e => e.user === currentUser._id && e.course === cid
        );
        
        if (alreadyEnrolled) {
            res.status(400).json({ message: "Already enrolled in this course" });
            return;
        }
        
        Database.enrollments.push(enrollment);
        console.log(`User ${currentUser._id} enrolled in course ${cid}`);
        res.json(enrollment);
    });

    // Unenroll a user from a course
    app.delete("/api/courses/:cid/enroll", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }
        
        const { cid } = req.params;
        
        // Count enrollments before filtering
        const beforeCount = Database.enrollments.length;
        
        Database.enrollments = Database.enrollments.filter(
            e => !(e.user === currentUser._id && e.course === cid)
        );
        
        // Count enrollments after filtering
        const afterCount = Database.enrollments.length;
        
        console.log(`User ${currentUser._id} unenrolled from course ${cid}. Removed ${beforeCount - afterCount} enrollments.`);
        res.json({ 
            message: "Successfully unenrolled",
            userId: currentUser._id,
            courseId: cid
        });
    });

    // Get all enrollments for a specific user
    app.get("/api/users/:uid/enrollments", (req, res) => {
        const { uid } = req.params;
        const enrollments = Database.enrollments.filter(
            enrollment => enrollment.user === uid
        );
        console.log(`Fetching enrollments for user ${uid}: Found ${enrollments.length}`);
        res.json(enrollments);
    });
    
    // Get all enrollments (for admin/debug)
    app.get("/api/enrollments", (req, res) => {
        console.log(`Fetching all enrollments: Found ${Database.enrollments.length}`);
        res.json(Database.enrollments);
    });
    
    // Add new enrollment (alternative endpoint for testing)
    app.post("/api/enrollments", (req, res) => {
        const { userId, courseId } = req.body;
        
        if (!userId || !courseId) {
            res.status(400).json({ message: "Missing required fields: userId and courseId" });
            return;
        }
        
        const enrollment = {
            _id: uuidv4(),
            user: userId,
            course: courseId
        };
        
        // Check if already enrolled
        const alreadyEnrolled = Database.enrollments.some(
            e => e.user === userId && e.course === courseId
        );
        
        if (alreadyEnrolled) {
            res.status(400).json({ message: "Already enrolled in this course" });
            return;
        }
        
        Database.enrollments.push(enrollment);
        console.log(`User ${userId} enrolled in course ${courseId} (via /api/enrollments)`);
        res.json(enrollment);
    });
}