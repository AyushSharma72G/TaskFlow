
import { FolderKanban } from 'lucide-react';
import { ListTodo } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { CircleDashed } from 'lucide-react';

export const progressBarConstants = [
    {id:1,icon:<FolderKanban color='var( --color-primary)' size={30} style={{color:'--color-primary-dark', background:'--color-primary-dark'}}/>,count:3,progress:'Projects'},
    {id:2,icon:<ListTodo color='var( --color-primary)' size={30} />,count:24,progress:'Tasks'},
    {id:3,icon:<CircleCheck size={30} color="#87ae73"/>,count:12,progress:'Completed'},
    {id:4,icon:<CircleDashed size={30} color='var( --color-primary)'/>,count:50,progress:'Overall Progress'}
]
