import {db} from './db';
import * as table from '../config/tables';

type ProjectId = number;

export class Project {
    id: ProjectId;
    constructor(public title: string, public description: string, 
                public owner?: number, public isProtected?: boolean, 
                public hash?: string) {}
}


export function addProject( title: string, description: string, ownerId?: number, 
                            isProtected?: boolean, hash?: string): Promise<ProjectId> {

    if(title == null || title.length < 1){
        return Promise.reject("No title");
    }
    if(ownerId == null) {
        isProtected = false;
        hash = undefined;
    }

    let proj = new Project(title, description, ownerId, isProtected, hash);

    let query = db(table.project)
    .insert(proj)
    .returning('id')
    .then((arr) => arr[0]);

    return query;
}

export function findProjectByPrefix(title: string): Promise<Project[]>
{
    let query = db(table.project)
    .select('*')
    .where('title', 'LIKE', title + '%');

    return query;
}

export function findProjectByTitle(title: string): Promise<Project>
{
    let query = db(table.project)
    .select('*')
    .where('title', title)
    .then((list) => {
        return list[0];
    });

    return query;
}