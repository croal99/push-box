import {ArrowLeftIcon, QuestionMarkCircledIcon, ResetIcon} from "@radix-ui/react-icons";
import {Button, Dialog, Flex, Kbd, Text, TextField} from "@radix-ui/themes";
import {useEffect, useState} from 'react'
import {PushBoxOnChain} from "@/types/PushBoxOnChain.ts";

let w = 35, h = 35;
let currentMan: any;         // 当前小人（有四个方向 具体显示哪个图片需要和上下左右方位值关联）

const BASE_IMAGE_URL = "https://croal99.github.io/push-box/push-box/images/";

const oImgs = {
    "block": `${BASE_IMAGE_URL}block.gif`,
    "wall": `${BASE_IMAGE_URL}wall.png`,
    "box": `${BASE_IMAGE_URL}box.png`,
    "ball": `${BASE_IMAGE_URL}ball.png`,
    "up": `${BASE_IMAGE_URL}up.png`,
    "down": `${BASE_IMAGE_URL}down.png`,
    "left": `${BASE_IMAGE_URL}left.png`,
    "right": `${BASE_IMAGE_URL}right.png`,
}

let images = {
    block: undefined,
    wall: undefined,
    box: undefined,
    ball: undefined,
    up: undefined,
    down: undefined,
    left: undefined,
    right: undefined,
};


const showHelp = () => {
    console.log('show help')
}

/**
 * 每次移动更新地图数据都先清空再添加新的地图
 */
const copyMap = (arr: number[][]) => {
    let b = [];
    for (let i = 0; i < arr.length; i++) {
        b[i] = arr[i].concat();
    }
    return b;
}

//小人位置坐标
function Point(this: any, x: number, y: number) {
    this.x = x;
    this.y = y;
}

// 小人的初始标值
let perPosition = new Point(5, 5);
let baseMap: number[][];                // 基础地图
let currentMap: number[][];             // 当前地图（保存修改后）
let mapIndex = 0;               // 地图索引
let moveSteps = 0;              //  移动次数
let moveStepsTotal = 0;              //  移动次数

let canvas: HTMLCanvasElement;
let cxt: CanvasRenderingContext2D;

export function PlayGame(
    {
        playManager,
        playMaps,
        handelPayForUpdateRecord,
        setBack,
    }) {
    const [isPass, setIsPass] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [nickname, setNickname] = useState("");


    function debug_info() {
        console.log('play Manager', playManager);
        console.log('play Maps', playMaps);
        console.log('canvas', canvas);
        console.log('map index', mapIndex);
        console.log('move step', moveSteps);
        console.log('base map', baseMap);
        console.log('current map', currentMap);
        handelPayForUpdateRecord(playManager.id.id, 'bbbb', 99998, moveStepsTotal, handlePaySuccess, handlePayError);
    }

    function initCanvas() {
        console.log('init canvas')
        canvas = document.getElementById("game-box") as HTMLCanvasElement;
        cxt = canvas.getContext("2d");
    }

    // 初始化地图
    function InitMap() {
        let block = images.block;

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                cxt.drawImage(block, w * j, h * i, w, h);
            }
        }
    }

    function DrawMap(map_array) {
        for (let i = 0; i < map_array.length; i++) {
            for (let j = 0; j < map_array[i].length; j++) {
                let pic = images.block;//初始图片
                switch (map_array[i][j]) {
                    case 1://绘制墙壁
                        pic = images.wall;
                        break;
                    case 2://绘制陷阱
                        pic = images.ball;
                        break;
                    case 3://绘制箱子
                        pic = images.box;
                        break;
                    case 4://绘制小人
                        pic = currentMan;//小人有四个方向 具体显示哪个图片需要和上下左右方位值关联
                        //获取小人的坐标位置
                        perPosition.x = i;
                        perPosition.y = j;
                        break;
                    case 5://绘制箱子及陷进位置
                        pic = images.box;
                        break;
                }
                // 每个图片不一样宽 需要在对应地板的中心绘制地图
                cxt.drawImage(pic, w * j - (pic.width - w) / 2, h * i - (pic.height - h), pic.width, pic.height)
            }
        }
    }

    const initGame = () => {
        // 初始化小人方向
        currentMan = images.down;

        // 绘制空地图（清空上一副地图）
        InitMap();

        // 绘制当前地图
        DrawMap(currentMap);
    }

    // 监控键盘
    const onKeyPress = (e) => {
        // console.log('key press', e.keyCode)
        switch (e.keyCode) {
            case 37://左键头
            case 65:
                go("left");
                break;
            case 38://上键头
            case 87:
                go("up");
                break;
            case 39://右箭头
            case 68:
                go("right");
                break;
            case 40://下箭头
            case 83:
                go("down");
                break;
        }
    }

    const go = (dir) => {
        let p1, p2;

        switch (dir) {
            case 'up':
                currentMan = images.up;
                p1 = new Point(perPosition.x - 1, perPosition.y);
                p2 = new Point(perPosition.x - 2, perPosition.y);
                break;

            case 'down':
                currentMan = images.down;
                p1 = new Point(perPosition.x + 1, perPosition.y);
                p2 = new Point(perPosition.x + 2, perPosition.y);
                break;

            case 'left':
                currentMan = images.left;
                p1 = new Point(perPosition.x, perPosition.y - 1);
                p2 = new Point(perPosition.x, perPosition.y - 2);
                break;

            case 'right':
                currentMan = images.right;
                p1 = new Point(perPosition.x, perPosition.y + 1);
                p2 = new Point(perPosition.x, perPosition.y + 2);
                break;
        }

        if (tryGo(p1, p2)) {
            moveSteps++;
        }

        // 绘制地板
        InitMap();

        // 绘制更新后地图
        DrawMap(currentMap);

        // 检查是否移动到位
        if (checkFinish()) {
            if (mapIndex == playMaps.length - 1) {
                console.log('finish')
                if (moveStepsTotal < playManager.record.step) {
                    setIsUpdate(true);
                } else {
                    setIsFinish(true);
                }
            } else {
                console.log('pass!!!', mapIndex)
                setIsPass(true);
            }
        }
    }

    const tryGo = (p1, p2) => {
        if (p1.x < 0) return false;//若果超出地图的上边，不通过
        if (p1.y < 0) return false;//若果超出地图的左边，不通过
        if (p1.x > currentMap.length) return false;//若果超出地图的下边，不通过
        if (p1.y > currentMap[0].length) return false;//若果超出地图的右边，不通过
        if (currentMap[p1.x][p1.y] == 1) return false;//若果前面是墙，不通过
        if (currentMap[p1.x][p1.y] == 3 || currentMap[p1.x][p1.y] == 5) {//若果小人前面是箱子那就还需要判断箱子前面有没有障碍物(箱子/墙)
            if (currentMap[p2.x][p2.y] == 1 || currentMap[p2.x][p2.y] == 3) {
                return false;
            }
            //若果判断不成功小人前面的箱子前进一步
            currentMap[p2.x][p2.y] = 3;//更改地图对应坐标点的值
        }
        //若果都没判断成功小人前进一步
        currentMap[p1.x][p1.y] = 4;//更改地图对应坐标点的值
        //若果小人前进了一步，小人原来的位置如何显示
        // console.log('perPosition', perPosition, baseMap)
        let v = baseMap[perPosition.x][perPosition.y];
        if (v != 2)//若果刚开始小人位置不是陷进的话
        {
            if (v == 5)//可能是5 既有箱子又陷进
            {
                v = 2;//若果小人本身就在陷进里面的话移开之后还是显示陷进
            } else {
                v = 0;//小人移开之后之前小人的位置改为地板
            }
        }
        //重置小人位置的地图参数
        currentMap[perPosition.x][perPosition.y] = v;
        //若果判断小人前进了一步，更新坐标值
        perPosition = p1;
        //若果小动了 返回true 指代能够移动小人
        return true;

    }

    //判断是否推成功
    function checkFinish() {
        for (let i = 0; i < currentMap.length; i++) {
            for (let j = 0; j < currentMap[i].length; j++) {
                //当前移动过的地图和初始地图进行比较，若果初始地图上的陷进参数在移动之后不是箱子的话就指代没推成功
                if (baseMap[i][j] == 2 && currentMap[i][j] != 3 || baseMap[i][j] == 5 && currentMap[i][j] != 3) {
                    return false;
                }
            }
        }
        return true;
    }

    const playNext = () => {
        // 记录移动总步数
        moveStepsTotal = moveStepsTotal + moveSteps;

        // 更新下一关地图
        mapIndex++;
        baseMap = copyMap(playMaps[mapIndex].data);
        currentMap = copyMap(playMaps[mapIndex].data);
        currentMan = images.down;
        moveSteps = 0;

        // close dialog
        setIsPass(false);

        // 绘制更新后地图
        InitMap();
        DrawMap(currentMap);
    }

    const payForUpdateGame = () => {
        handelPayForUpdateRecord(playManager.id.id, nickname, 99998, moveStepsTotal, handlePaySuccess, handlePayError);
    }

    const handlePaySuccess = () => {
        setBack();
    }

    const handlePayError = (result) => {
        console.log('trans error', result.message);

    }

    useEffect(() => {
        // console.log('Play game', playMaps, playMaps.length);
        baseMap = copyMap(playMaps[mapIndex].data);
        currentMap = copyMap(playMaps[mapIndex].data);

        // 初始化canvas
        initCanvas();

        // 预加载图片
        let count = 0, imgNum = 0;

        for (let src in oImgs) {
            imgNum++;
        }

        for (let src in oImgs) {
            // console.log('src', src)
            images[src] = new Image();
            images[src].onload = function () {
                // 判断是否所有的图片都预加载完成
                if (++count >= imgNum) {
                    console.log('load all images');
                    initGame();
                }
            }
            images[src].src = oImgs[src];
        }

        // 注册键盘事件
        window.addEventListener('keydown', onKeyPress)

        // 当组件卸载时执行清理函数
        return () => {
            console.log('game unmounted');
            window.removeEventListener('keydown', onKeyPress) // 销毁
        };

    }, []);

    return (
        <>
            <div className="game">
                <canvas id="game-box" width="560" height="560"></canvas>
                <div id="msg"></div>
                <Flex gap="3">
                    <Button onClick={showHelp}>
                        <QuestionMarkCircledIcon/> Help
                    </Button>

                    <Dialog.Root>
                        <Dialog.Trigger>
                            <Button><ResetIcon/>Exit</Button>
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="400px">
                            <Dialog.Title>Confirm</Dialog.Title>
                            <Dialog.Description size="2" mb="4">
                                Exiting the game
                            </Dialog.Description>

                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Exiting the game will not save your progress, and you will need to pay again to
                                        re-enter the game. Are you sure you want to exit?
                                    </Text>
                                </label>
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button variant="soft" color="gray">
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button onClick={setBack}>
                                        Exit
                                    </Button>
                                </Dialog.Close>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                </Flex>
            </div>
            <Dialog.Root open={isPass}>
                <Dialog.Content maxWidth="400px">
                    <Dialog.Title>Success</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Congratulations, you used {moveSteps} steps pass!
                            </Text>
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button onClick={playNext}>Next</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
            <Dialog.Root open={isFinish}>
                <Dialog.Content maxWidth="400px">
                    <Dialog.Title>Success</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Congratulations, you passed in 10 minutes!
                            </Text>
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button onClick={setBack}>Close</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
            <Dialog.Root open={isUpdate}>
                <Dialog.Content maxWidth="400px">
                    <Dialog.Title>Congratulations</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        You've broken the record!
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1">
                                You can pay 0.001 Sui to register your name in the
                                Game Plaza.
                            </Text>
                            <Text as="div" size="2" mb="1" weight="bold">
                                *The nickname cannot exceed 10 characters.
                            </Text>
                        </label>
                        <label>
                            <TextField.Root
                                value={nickname}
                                placeholder="Enter nickname(No more than 10 characters)"
                                onChange={e => {
                                    setNickname(e.target.value);
                                }}
                            />
                        </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="surface" onClick={setBack}>Close</Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button onClick={payForUpdateGame}>Pay and Close</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </>
    )
}

