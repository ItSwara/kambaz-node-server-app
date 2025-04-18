// import mongoose from "mongoose";
// const schema = new mongoose.Schema(
//     {
//         name: String,
//         description: String,
//         course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
//     },
//     { collection: "modules",
//         versionKey: false
//      }
// );
// export default schema;



// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// const lessonSchema = new mongoose.Schema({
//   _id: { type: String, default: () => uuidv4() },
//   name: String,
//   description: String,
//   module: String
// });

// const schema = new mongoose.Schema(
//   {
//     _id: { type: String, default: () => uuidv4() },
//     name: String,
//     description: String,
//     course: { type: String, ref: "CourseModel" },
//     lessons: [lessonSchema],
//     editing: { type: Boolean, default: false }
//   },
//   { collection: "modules" }
// );

// export default schema;




// import mongoose from "mongoose";
// const schema = new mongoose.Schema(
//   {
//     _id: String,
//     name: String,
//     description: String,
//     course: { type: String, ref: "CourseModel" },
//     lessons: [{ 
//         _id: String,
//         name: String 
//       }],
//       editing: { type: Boolean, default: false }
//   },
//   { collection: "modules" }
// );
// export default schema;

// schema.js
import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    course: { type: String, ref: "CourseModel" },
    lessons: [{ 
      _id: String,
      name: String,
      description: String,
      module: String
    }],
    editing: { type: Boolean, default: false }
  },
  { collection: "modules" }
);

export default schema;