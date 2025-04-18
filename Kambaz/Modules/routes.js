import * as modulesDao from "./dao.js";
//import * as modulesDao from "../Modules/dao.js";
export default function ModuleRoutes(app) {
 app.delete("/api/modules/:moduleId", async (req, res) => {
   const { moduleId } = req.params;
   const status = await modulesDao.deleteModule(moduleId);
   res.send(status);
});

// app.put("/api/modules/:moduleId", async (req, res) => {
//     const { moduleId } = req.params;
//     const moduleUpdates = req.body;
//     const status = await modulesDao.updateModule(moduleId, moduleUpdates);
//     res.send(status);
//   });

// On the server
// app.put("/api/modules/:moduleId", async (req, res) => {
//   try {
//     const { moduleId } = req.params;
//     const moduleUpdates = req.body;
//     const updatedModule = await modulesDao.updateModule(moduleId, moduleUpdates);
//     console.log("Updated module:", updatedModule);
//     res.json(updatedModule);  // Make sure you're returning the updated module
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update module" });
//   }
// });



app.put("/api/modules/:moduleId", async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const updatedModule = await modulesDao.updateModule(moduleId, moduleUpdates);
    
    // Send back the full updated module object
    res.json(updatedModule);
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ error: "Failed to update module" });
  }
});

  // app.get("/api/courses/:courseId/modules", async (req, res) => {
  //   const { courseId } = req.params;
  //   const modules = await modulesDao.findModulesForCourse(courseId);
  //   res.json(modules);
  // });




}

