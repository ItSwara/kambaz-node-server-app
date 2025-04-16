import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Get assignments for a course
  app.get("/api/courses/:cid/assignments", async (req, res) => {
    const { cid } = req.params;
    const assignments = await assignmentsDao.findAssignmentsForCourse(cid);
    res.send(assignments);
  });

  // Get specific assignment by ID
  app.get("/api/assignments/:aid", async (req, res) => {
    const { aid } = req.params;
    const assignment = await assignmentsDao.findAssignmentById(aid);
    res.send(assignment);
  });

  // Create new assignment for a course
  app.post("/api/courses/:cid/assignments", async (req, res) => {
    const { cid } = req.params;
    const assignment = req.body;
    assignment.course = cid;
    const newAssignment = await assignmentsDao.createAssignment(assignment);
    res.send(newAssignment);
  });

  // Update assignment
  app.put("/api/assignments/:aid", async (req, res) => {
    const { aid } = req.params;
    const updates = req.body;
    const status = await assignmentsDao.updateAssignment(aid, updates);
    res.send(status);
  });

  // Delete assignment
  app.delete("/api/assignments/:aid", async (req, res) => {
    const { aid } = req.params;
    const status = await assignmentsDao.deleteAssignment(aid);
    res.send(status);
  });
}