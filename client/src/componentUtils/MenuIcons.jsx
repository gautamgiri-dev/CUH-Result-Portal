import {
  MdSpaceDashboard,
  MdCloudUpload,
  MdRemoveRedEye,
  MdNoteAdd,
} from "react-icons/md";

import { HiUsers } from "react-icons/Hi";

const HodMenuIcons = [
  {
    icon: <MdSpaceDashboard />,
    title: "Dashboard",
    link: "./dashboard",
  },
  {
    icon: <MdCloudUpload />,
    title: "Upload Marks",
    link: "./upload",
  },
  {
    icon: <MdRemoveRedEye />,
    title: "View Records",
    link: "./view",
  },
  {
    icon: <MdNoteAdd />,
    title: "Manage Courses",
    link: "./courses",
  },
];

const AdminMenuIcons = [
  // {
  //   icon: <MdSpaceDashboard />,
  //   title: "Dashboard",
  //   link: "./dashboard",
  // },
  // {
  //   icon: <MdRemoveRedEye />,
  //   title: "View Records",
  //   link: "./view",
  // },
  {
    icon: <HiUsers />,
    title: "Manage Users",
    link: "./users",
  },
];

// exports
export { HodMenuIcons, AdminMenuIcons };
