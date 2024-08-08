<template>
    <qrcode-stream @detect="onDetect" :track="paintOutline"></qrcode-stream>
</template>

<script setup>
    import {ref} from 'vue'
    import { QrcodeStream  } from "vue3-qrcode-reader";
    
    const result = ref('')

    const onDetect = async (detectedCodes) => {
        result.value = await detectedCodes
            .then( r => {
                // console.log(r.content)
                return r.content
            })
        // result.value = JSON.stringify(
        //     await detectedCodes.rawValue
        // )
        // console.log(result.value)
        // console.log(result.value)
    }

    const paintOutline = (decodeData, ctx) => {

        var points = []
        for (var [key, value] of Object.entries(decodeData)) {
            switch (key) {
                case "topLeftCorner":
                    
                    points[0] = value
                    break;
                
                case "topRightCorner":
                    
                    points[1] = value
                    break;

                case "bottomRightCorner":
                    points[2] = value
                    break;
                
                case "bottomLeftCorner":
                    points[3] = value
                    break;
            
                default:
                    break;
            }
        }
        ctx.lineWidth = 10
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for( const {x, y} of points){
            ctx.lineTo(x, y)
        }
        ctx.lineTo(points[0].x, points[0].y)
        ctx.closePath()
        ctx.stroke()
    }
</script>