import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js"
export default function CourseRoutes(app) {
  app.get("/api/courses", async(req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });

  app.delete("/api/courses/:courseId",  async(req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  app.put("/api/courses/:courseId", async(req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });


  // //retrieveing modules
  // app.get("/api/courses/:courseId/modules", (req, res) => {
  //   const { courseId } = req.params;
  //   const modules = modulesDao.findModulesForCourse(courseId);
  //   res.json(modules);
  // });

    // In your routes.js file
    app.get("/api/courses/:courseId/modules", async (req, res) => {
      try {
        console.log("Request params:", req.params);
        const courseId = req.params.courseId;
        console.log(`Fetching modules for course ${courseId}`);
        
        // Add a check to make sure modulesDao exists and has the findModulesForCourse function
        console.log("modulesDao functions:", Object.keys(modulesDao));
        
        const modules = await modulesDao.findModulesForCourse(courseId);
        console.log("In Routes file : ---------------------",modules)
        console.log("Modules found:", JSON.stringify(modules));
        
        res.json(modules || []);  // Ensure we always return an array
      } catch (error) {
        console.error("Error fetching modules:", error);
        res.status(500).json({ error: "Failed to fetch modules", message: error.message });
      }
    });

  // createing modules
  app.post("/api/courses/:courseId/modules", async(req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });

  app.post("/api/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);
    res.json(course);
  });
 

   // Enroll current user in a course
   const enrollInCourse = async (req, res) => {
    try {
      const { cid } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const enrollment = await enrollmentsDao.enrollUserInCourse(
        currentUser._id, 
        cid
      );
      
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Server error during enrollment" });
    }
  };
  
  // Unenroll current user from a course
  const unenrollFromCourse = async (req, res) => {
    try {
      const { cid } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const result = await enrollmentsDao.unenrollUserFromCourse(
        currentUser._id, 
        cid
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      res.status(500).json({ message: "Server error during unenrollment" });
    }
  };
  

   // Enrollment endpoints
   app.post("/api/courses/:cid/enroll", enrollInCourse);
   app.delete("/api/courses/:cid/enroll", unenrollFromCourse);

}


