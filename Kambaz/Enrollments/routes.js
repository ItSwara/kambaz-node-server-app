import Database from "../Database/index.js";

export default function EnrollmentRoutes(app) {
    
    app.get("/api/courses", (req, res) => {
        const { courses } = Database;
        console.log("Fetching courses from database:", Database.courses);
        res.json(courses);
    });

    app.post("/api/courses/:cid/enroll", (req, res) => {
        console.log("Current user session:", req.session["currentUser"]);
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }
        const { cid } = req.params;
        const enrollment = {
            _id: new Date().getTime().toString(),
            user: currentUser._id,
            course: cid
        };
        Database.enrollments.push(enrollment);
        res.json(enrollment);
    });

    app.delete("/api/courses/:cid/enroll", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }
        const { cid } = req.params;
        Database.enrollments = Database.enrollments.filter(
            e => !(e.user === currentUser._id && e.course === cid)
        );
        res.json({ message: "Successfully unenrolled" });
    });

    app.get("/api/users/:uid/enrollments", (req, res) => {
        const { uid } = req.params;
        const enrollments = Database.enrollments.filter(
            enrollment => enrollment.user === uid
        );
        res.json(enrollments);
    });
}