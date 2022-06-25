
export default function createRoomId(...strings) {
    strings.sort();
    let result = ""; 
    strings.forEach(el => result += el);
    return result;
}