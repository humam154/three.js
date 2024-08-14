import { BoxGeometry, Euler, Mesh, Vector3 } from "three";
import * as oceanMaterials from "../materials/OceanMaterial.js";

export let blocks = [];

function CreateBox(postion, rotation, scale)
{
    const geometry = new BoxGeometry(scale.x, scale.y, scale.z);
    geometry.rotateX(rotation.x);
    geometry.rotateY(rotation.y);
    geometry.rotateZ(rotation.z);
    const box = new Mesh(geometry, oceanMaterials.object);
    box.position.set(postion.x, postion.y, postion.z);
    box.geometry.computeVertexNormals();
    blocks.push(box);
}

export function Start()
{
    
 }