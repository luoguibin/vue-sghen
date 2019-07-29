export const FireworkCenter = {

    showFireWork(model, id) {
        if (id === 0) {
            for (let i = 0; i < 50; i++) {
                const sprite = this.newBaseSprite();
                const index = Math.round(Math.random() * 2);
                this["attachFireWork" + index](sprite, model)
                model.add(sprite);
            }
        } else if (id === 1) {
            this.newFireWorkByWord(model, "乐");
        }
    },

    newFireWorkByWord(model, word) {
        const points = this.newCanvasTextPoints(word);
        for (let i = 0; i < points.length; i++) {
            const sprite = this.newBaseSprite();
            this.attachWordFireWork(sprite, model, points[i]);
            model.add(sprite);
        }
    },

    attachWordFireWork(sprite, model, point) {
        point.z = point.y;
        point.y = 20;

        point.x /= 10;
        point.z /= 10;

        point.x -= 128 / 10 / 2;
        point.z -= 128 / 10 / 2;

        new TWEEN.Tween(sprite.position)
            // .delay(Math.random() * 2000)
            .to(point, 4000)
            .onUpdate(() => {
                sprite.material.opacity = Math.cos(sprite.position.y) + 1;
            })
            .onComplete(() => {
                model.remove(sprite);
            })
            .start();
    },

    attachFireWork0(sprite, model) {
        new TWEEN.Tween(sprite.position)
            .delay(Math.random() * 2000)
            .to({
                x: Math.random() * 5 * this.newFlag(),
                y: 20,
                z: Math.random() * 5 * this.newFlag()
            }, 3000)
            .onComplete(() => {
                model.remove(sprite);
            })
            .start();
    },

    newFlag() {
        return Math.random() < 0.5 ? 1 : -1;
    },

    attachFireWork1(sprite, model) {
        const obj = { v: 0 }
        new TWEEN.Tween(obj)
            .delay(Math.random() * 2000)
            .to({ v: Math.PI * 20 }, 5000)
            .onUpdate(() => {
                const val = 10 * obj.v / (Math.PI * 20);
                sprite.position.y = val;
                sprite.position.x = val / 2 * Math.sin(obj.v);
                sprite.position.z = val / 2 * Math.cos(obj.v);
            })
            .onComplete(() => {
                model.remove(sprite);
            })
            // .repeat(3)
            .start()
    },

    attachFireWork2(sprite, model) {
        const obj = { v: 0 }
        new TWEEN.Tween(obj)
            .delay(Math.random() * 2000)
            .to({ v: Math.PI * 20 }, 5000)
            .onUpdate(() => {
                const val = 15 * obj.v / (Math.PI * 20);
                sprite.position.y = val;
                sprite.material.opacity = Math.cos(obj.v / 3) + 1;
            })
            .onComplete(() => {
                model.remove(sprite);
            })
            .start()
    },

    newBaseSprite() {
        const spriteMaterial = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(this.newCanvas(32, 32)),
            color: 0xffffff
            // blending: THREE.AdditiveBlending
        });
        spriteMaterial.transparent = true;
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.x = 0;
        sprite.position.z = 0;
        sprite.position.y = -1;

        return sprite;
    },

    newCanvas(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width ? width : 128;
        canvas.height = height ? height : 128;
        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, `rgba(${THREE.Math.randInt(222, 255)},${THREE.Math.randInt(222, 255)},${THREE.Math.randInt(222, 255)},1)`);
        gradient.addColorStop(0.1, `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},1)`);
        gradient.addColorStop(0.4, `rgba(${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},${THREE.Math.randInt(0, 255)},0.7)`);
        gradient.addColorStop(0.8, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0 &&
                imageData.data[i] === imageData.data[i + 1] &&
                imageData.data[i] === imageData.data[i + 2]) {
                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = 0;
            }
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
    },

    newCanvasTextPoints(text, add) {
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");
        const width = 128,
            height = 128,
            unit = 7;
        canvas.width = width;
        canvas.height = height;
        ctx.font = "100px Arial";
        ctx.fillStyle = "#ff0000";
        ctx.fillText(text, 0, height * 0.8);
        // document.body.appendChild(canvas);

        const points = [];
        const imageData = ctx.getImageData(0, 0, width, height).data;
        let i = 0, j = 0;
        for (; true;) {
            const index = (j * width + i) * 4;
            if (imageData[index] === 255 && imageData[index + 1] === 0) {
                points.push({
                    x: i,
                    y: j
                })
            }
            i += unit;
            if (i > width) {
                i = 0;
                j += unit;

                if (j > height) {
                    break;
                }
            }
        }

        return points;
    }
}