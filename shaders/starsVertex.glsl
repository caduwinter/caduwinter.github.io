varying vec3 vertexNormal;

void main(){
    vertexNormal = normalize(normalMatrix * normal);
    gl_PointSize = 100.0;
}
