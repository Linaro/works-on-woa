import writeYamlFile from "write-yaml-file";
import projectsData from "./data/MOCK_DATA_13.json" assert { type: "json" };

const categoryOptions = [
  "oss",
  "tools",
  "kernel",
  "web",
  "linux",
  "dotnet",
  "visualstudio",
  "embedded",
  "testing",
  "emulation",
];

projectsData.forEach((project) => {
  writeYamlFile(`src/content/projects/${project.name}.yaml`, {
    ...project,
    categories: [
      categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
      categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
      categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
    ].filter((item, index, arr) => arr.indexOf(item) === index),
  }).then(() => {
    console.log("done");
  });
});

// writeYamlFile(`src/content/projects/test.yaml`, {
//   ...projectsData[0],
//   categories: [
//     categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
//     categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
//     categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
//   ].filter((item, index, arr) => arr.indexOf(item) === index),
// }).then(() => {
//   console.log("done");
// });
