
import '../../../styles/index.css'

import { MdManageAccounts } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { PiMicrosoftTeamsLogo } from "react-icons/pi";
import { SiProgress } from "react-icons/si";
import { TbTopologyStar3 } from "react-icons/tb";
import { RxActivityLog } from "react-icons/rx";

export const featureConstants = [
    {id:1, icon:<MdManageAccounts size={30} color='#ffffff' style={{background:'var( --color-primary-dark)', borderRadius:'var(--radius-sm)' }}/>, title:'Manage Projects'},
    {id:2, icon:<FaTasks size={30} color='#ffffff' style={{background:'var(--color-primary-dark)',borderRadius:'var(--radius-sm)'  }} />, title:'Organize Tasks'},
    {id:3, icon:<PiMicrosoftTeamsLogo size={30} color='#ffffff' style={{background:'var(--color-primary-dark)',borderRadius:'var(--radius-sm)'  }} />, title:'Invite Your Team'},
    {id:4, icon:<SiProgress size={30} color='#ffffff' style={{background:'var( --color-primary-dark)',borderRadius:'var(--radius-sm)'  }}/>, title:'Track Progress'},
    {id:5, icon:<TbTopologyStar3 size={30} color='#ffffff' style={{background:'var( --color-primary-dark)',borderRadius:'var(--radius-sm)'  }} />, title:'AI Task Descriptions'},
    {id:6, icon:<RxActivityLog size={30} color='#ffffff' style={{background:'var( --color-primary-dark)',borderRadius:'var(--radius-sm)'  }} />, title:'Activity Logs'}
]