<template>
    <div class="w-96 h-96 m-auto">
        <div>{{ result }}</div>
        <qrcode-stream 
            :paused="paused"
            :track="paintBoundingBox"
            @detect="onDetect"
            @camera-on="onCameraOn"
            @camera-off="onCameraOff"
            @error="onError"
        >
            <div
                v-show="showScanConfirmation"
                class="scan-confirmation"
            >
                <img
                    src="@/assets/checkmark.svg"
                    alt="Checkmark"
                    width="128">
                </div>
        </qrcode-stream>
        <div v-show="paused">
            <h1 class="text-3xl font-bold underline">
                Autorizado
            </h1>
        </div>
    </div>
</template>

<script setup>
    import {ref, inject} from 'vue'
    import { QrcodeStream  } from "vue-qrcode-reader";
    
    const axios = inject('axios')
    const result = ref('')
    const paused = ref(false)
    const showScanConfirmation = ref(false)
    const BASE_URL = import.meta.env.VITE_API_URL

    const liberaCatraca = () => {
        axios.get("http://10.1.1.95:9000/liberacatraca")
        .then( response => {
            console.log('CATRACA LIBERARADA')
        })
        .catch( err => {
            console.log('ERRO AO LIBERAR CATRACA')
            console.log(err.message)
        }) 
    }

    const onDetect = async (detectedCodes) => {
      const tmp = detectedCodes.map((code) => code.rawValue)
      await axios.get(`${BASE_URL}/pessoa/v1/pessoas/${tmp[0]}`)
        .then( response => {
            liberaCatraca()
            const first_name = response.data.nome.split(" ")
            result.value = first_name[0]
        })
        .catch( err => {
            console.log(err.message)
        })

      paused.value = true
      await timeout(800)
      paused.value = false
      result.value = ''
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

    const paintBoundingBox = (detectedCodes, ctx) => {
        for (const detectedCode of detectedCodes) {
            const {
                boundingBox: { x, y, width, height }
            } = detectedCode

            ctx.lineWidth = 4
            ctx.strokeStyle = '#007bff'
            ctx.strokeRect(x, y, width, height)
        }
    }

    const onError = (error) => console.error

    const onCameraOn = () => {
        showScanConfirmation.value = false
    }

    const onCameraOff = () => {
        showScanConfirmation.value = true
    }

    const timeout = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }
</script>

<style scoped>
    .scan-confirmation {
        position: absolute;
        width: 100%;
        height: 100%;

        background-color: rgba(255, 255, 255, 0.8);

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
    }
</style>