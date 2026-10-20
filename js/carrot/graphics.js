/**
 * ============================================================================
 * THỎ GOM CÀ RỐT - GRAPHICS & PROCEDURAL VECTOR RENDERER
 * Vẽ toàn bộ thế giới hoạt hình bằng HTML5 Canvas 2D mượt mà, sắc nét mọi độ phân giải
 * ============================================================================
 */

class GraphicsRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.clouds = [
      { x: 120, y: 70, scale: 0.9, speed: 0.15 },
      { x: 480, y: 110, scale: 1.1, speed: 0.22 },
      { x: 890, y: 65, scale: 0.8, speed: 0.18 },
      { x: 1200, y: 95, scale: 1.0, speed: 0.25 }
    ];
    this.flowers = this.generateFlowers();
    this.time = 0;
  }

  // Tạo các bông hoa ngẫu nhiên trên bãi cỏ
  generateFlowers() {
    const flowers = [];
    const colors = ['#FFFFFF', '#FEF08A', '#F472B6', '#93C5FD'];
    for (let i = 0; i < 28; i++) {
      flowers.push({
        x: 40 + Math.random() * 1200,
        y: 420 + Math.random() * 260,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 4,
        petalCount: 5
      });
    }
    return flowers;
  }

  update(dt) {
    this.time += dt;
    // Mây trôi nhẹ nhàng từ trái qua phải
    this.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > 1380) {
        cloud.x = -150;
      }
    });
  }

  // ---------------- VẼ NỀN ĐỒNG CỎ & BẦU TRỜI ----------------
  renderBackground() {
    const ctx = this.ctx;

    // 1. Bầu trời xanh tươi sáng
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 480);
    skyGrad.addColorStop(0, '#7DD3FC');
    skyGrad.addColorStop(0.6, '#BAE6FD');
    skyGrad.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1280, 720);

    // Vầng mặt trời ấm áp góc trên
    const sunGrad = ctx.createRadialGradient(1140, 90, 10, 1140, 90, 90);
    sunGrad.addColorStop(0, '#FEF08A');
    sunGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.5)');
    sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(1140, 90, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(1140, 90, 36, 0, Math.PI * 2);
    ctx.fill();

    // 2. Những đám mây trắng xốp
    this.clouds.forEach(c => this.drawCloud(c.x, c.y, c.scale));

    // 3. Đồi cỏ xa (Màu xanh pastel dịu)
    ctx.fillStyle = '#86EFAC';
    ctx.beginPath();
    ctx.moveTo(0, 380);
    ctx.bezierCurveTo(320, 320, 640, 410, 960, 340);
    ctx.bezierCurveTo(1120, 310, 1220, 330, 1280, 360);
    ctx.lineTo(1280, 720);
    ctx.lineTo(0, 720);
    ctx.closePath();
    ctx.fill();

    // Đồi cỏ gần hơn (Xanh mạ rực rỡ)
    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(0, 410);
    ctx.bezierCurveTo(350, 460, 750, 360, 1280, 430);
    ctx.lineTo(1280, 720);
    ctx.lineTo(0, 720);
    ctx.closePath();
    ctx.fill();

    // 4. Hàng rào gỗ nông trại đáng yêu
    this.drawFence();

    // 5. Bãi cỏ chính trước mặt
    const grassGrad = ctx.createLinearGradient(0, 450, 0, 720);
    grassGrad.addColorStop(0, '#22C55E');
    grassGrad.addColorStop(1, '#15803D');
    ctx.fillStyle = grassGrad;
    ctx.beginPath();
    ctx.moveTo(0, 450);
    ctx.bezierCurveTo(400, 435, 880, 465, 1280, 445);
    ctx.lineTo(1280, 720);
    ctx.lineTo(0, 720);
    ctx.closePath();
    ctx.fill();

    // 6. Những bông hoa nhỏ điểm xuyết
    this.drawFlowers();
  }

  // Vẽ đám mây xốp
  drawCloud(x, y, scale) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.arc(32, -12, 34, 0, Math.PI * 2);
    ctx.arc(68, -4, 28, 0, Math.PI * 2);
    ctx.arc(94, 6, 22, 0, Math.PI * 2);
    ctx.arc(45, 12, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Vẽ hàng rào gỗ
  drawFence() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#E2E8F0';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;

    // Thanh ngang hàng rào
    ctx.fillRect(0, 415, 1280, 10);
    ctx.strokeRect(0, 415, 1280, 10);
    ctx.fillRect(0, 435, 1280, 10);
    ctx.strokeRect(0, 435, 1280, 10);

    // Các cọc nhọn thẳng đứng
    for (let x = 30; x < 1280; x += 85) {
      ctx.beginPath();
      ctx.moveTo(x - 10, 455);
      ctx.lineTo(x - 10, 395);
      ctx.lineTo(x, 380); // Đỉnh nhọn
      ctx.lineTo(x + 10, 395);
      ctx.lineTo(x + 10, 455);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Vẽ các bông hoa nhỏ li ti trên bãi cỏ
  drawFlowers() {
    const ctx = this.ctx;
    ctx.save();
    this.flowers.forEach(fl => {
      ctx.fillStyle = fl.color;
      // Vẽ cánh hoa
      for (let p = 0; p < fl.petalCount; p++) {
        const angle = (p / fl.petalCount) * Math.PI * 2;
        const px = fl.x + Math.cos(angle) * fl.size;
        const py = fl.y + Math.sin(angle) * fl.size;
        ctx.beginPath();
        ctx.arc(px, py, fl.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      // Nhụy vàng tươi
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(fl.x, fl.y, fl.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // ---------------- VẼ BÁC GẤU NÔNG DÂN & CHIẾC XE/GIỎ CÀ RỐT ----------------
  renderFarmerBear(x, y, state = 'idle') {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    const bob = Math.sin(this.time * 3) * 2; // Nhịp thở nhẹ
    const isCelebrating = state === 'cheer';

    // 1. Thân áo gấu (Yếm bò màu xanh dương xinh xắn)
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.roundRect(-42, -35 + bob, 84, 75, [24, 24, 18, 18]);
    ctx.fill();

    // 2. Hai dây đai yếm có cúc vàng
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(-34, -45 + bob, 14, 50);
    ctx.fillRect(20, -45 + bob, 14, 50);

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(-27, -15 + bob, 4.5, 0, Math.PI * 2);
    ctx.arc(27, -15 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Đầu gấu màu nâu ấm áp
    ctx.fillStyle = '#854D0E';
    ctx.beginPath();
    ctx.arc(0, -65 + bob, 42, 0, Math.PI * 2);
    ctx.fill();

    // 4. Hai tai gấu tròn xinh
    ctx.fillStyle = '#854D0E';
    ctx.beginPath();
    ctx.arc(-36, -98 + bob, 18, 0, Math.PI * 2);
    ctx.arc(36, -98 + bob, 18, 0, Math.PI * 2);
    ctx.fill();

    // Vành trong của tai
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(-36, -98 + bob, 10, 0, Math.PI * 2);
    ctx.arc(36, -98 + bob, 10, 0, Math.PI * 2);
    ctx.fill();

    // 5. Mõm gấu màu be
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.ellipse(0, -56 + bob, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mũi đen hình tam giác bo góc
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(0, -62 + bob, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Miệng cười hiền từ
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (isCelebrating) {
      ctx.arc(0, -53 + bob, 8, 0, Math.PI); // Cười to khi đúng
    } else {
      ctx.arc(-5, -53 + bob, 5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.arc(5, -53 + bob, 5, 0.1 * Math.PI, 0.9 * Math.PI);
    }
    ctx.stroke();

    // 6. Đôi mắt long lanh
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(-16, -74 + bob, 5.5, 0, Math.PI * 2);
    ctx.arc(16, -74 + bob, 5.5, 0, Math.PI * 2);
    ctx.fill();
    // Đốm sáng trong mắt
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-14, -76 + bob, 2, 0, Math.PI * 2);
    ctx.arc(18, -76 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // Má hồng đáng yêu
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    ctx.arc(-26, -60 + bob, 7, 0, Math.PI * 2);
    ctx.arc(26, -60 + bob, 7, 0, Math.PI * 2);
    ctx.fill();

    // 7. Chiếc mũ rơm nông dân có nơ đỏ
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.ellipse(0, -96 + bob, 56, 12, 0, 0, Math.PI * 2); // Vành mũ
    ctx.fill();
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.ellipse(0, -108 + bob, 28, 18, 0, Math.PI, Math.PI * 2); // Chóp mũ
    ctx.fill();
    // Dải nơ đỏ trên mũ
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(-28, -104 + bob, 56, 6);

    // 8. Tay gấu (vẫy tay khi chúc mừng)
    ctx.fillStyle = '#854D0E';
    if (isCelebrating) {
      // Hai tay giơ cao hoan hô
      ctx.beginPath();
      ctx.ellipse(-48, -75 + bob, 14, 24, -0.6, 0, Math.PI * 2);
      ctx.ellipse(48, -75 + bob, 14, 24, 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Tay để trước bụng
      ctx.beginPath();
      ctx.ellipse(-42, -10 + bob, 12, 18, 0.3, 0, Math.PI * 2);
      ctx.ellipse(42, -10 + bob, 12, 18, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ---------------- VẼ GIỎ CÀ RỐT CỦA BÁC GẤU ----------------
  renderBasket(x, y, count, target, shake = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x + (shake ? Math.sin(this.time * 30) * 8 : 0), y);

    // Bóng đổ chiếc giỏ
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 60, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thân giỏ mây tre đan màu gỗ sáng
    ctx.fillStyle = '#C49156';
    ctx.beginPath();
    ctx.moveTo(-50, -20);
    ctx.lineTo(50, -20);
    ctx.lineTo(38, 20);
    ctx.lineTo(-38, 20);
    ctx.closePath();
    ctx.fill();

    // Vân đan chéo trên giỏ mây
    ctx.strokeStyle = '#8D5B2C';
    ctx.lineWidth = 2.5;
    for (let lx = -40; lx <= 40; lx += 14) {
      ctx.beginPath();
      ctx.moveTo(lx, -20);
      ctx.lineTo(lx * 0.8, 20);
      ctx.stroke();
    }
    // Vành miệng giỏ
    ctx.fillStyle = '#8D5B2C';
    ctx.beginPath();
    ctx.roundRect(-54, -26, 108, 12, 6);
    ctx.fill();

    // Vẽ cà rốt chất trong giỏ theo số lượng đã gom
    const displayCount = Math.min(count, 12);
    for (let i = 0; i < displayCount; i++) {
      const cx = -34 + (i % 5) * 17 + (Math.sin(i * 1.5) * 3);
      const cy = -26 - Math.floor(i / 5) * 14;
      const rot = ((i % 3) - 1) * 0.25;
      this.drawMiniCarrot(cx, cy, 0.9, rot);
    }

    ctx.restore();
  }

  // Củ cà rốt nhỏ gọn dùng vẽ trong giỏ
  drawMiniCarrot(x, y, scale = 1, rotation = 0) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    // Cuống lá xanh
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.ellipse(-4, -14, 3, 8, -0.3, 0, Math.PI * 2);
    ctx.ellipse(0, -16, 3, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -14, 3, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Củ cà rốt cam
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.quadraticCurveTo(0, -12, 8, -10);
    ctx.quadraticCurveTo(6, 6, 0, 16);
    ctx.quadraticCurveTo(-6, 6, -8, -10);
    ctx.closePath();
    ctx.fill();

    // Vạch gân củ
    ctx.strokeStyle = '#C2410C';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(2, -4);
    ctx.moveTo(-2, 2);
    ctx.lineTo(4, 2);
    ctx.stroke();

    ctx.restore();
  }

  // ---------------- VẼ LUỐNG CÀ RỐT (CARROT PATCH) ----------------
  renderCarrotPatch(patch, isHovered = false, isSelected = false) {
    const ctx = this.ctx;
    const { x, y, count, harvested } = patch;

    ctx.save();
    ctx.translate(x, y);

    // Vòng sáng nổi bật khi hover hoặc đã chọn
    if (isSelected) {
      ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 30, 140, 56, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (isHovered) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 30, 130, 52, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 1. Luống đất tơi xốp màu nâu sẫm
    const moundGrad = ctx.createLinearGradient(0, -10, 0, 65);
    moundGrad.addColorStop(0, '#5A3511');
    moundGrad.addColorStop(0.5, '#78350F');
    moundGrad.addColorStop(1, '#451A03');

    ctx.fillStyle = moundGrad;
    ctx.beginPath();
    ctx.ellipse(0, 30, 115, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Viền cỏ nhỏ xung quanh mép luống
    ctx.fillStyle = '#16A34A';
    for (let a = 0; a < Math.PI * 2; a += 0.35) {
      const tx = Math.cos(a) * 115;
      const ty = 30 + Math.sin(a) * 42;
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Vẽ các củ cà rốt trồng trên luống đất
    if (!harvested) {
      this.drawCarrotsOnPatch(count, isHovered);
    } else {
      // Nếu đã nhổ: vẽ các hố đất trống ngộ nghĩnh
      ctx.fillStyle = '#291305';
      for (let i = 0; i < Math.min(count, 6); i++) {
        const hx = -60 + i * 24;
        const hy = 22 + (i % 2) * 10;
        ctx.beginPath();
        ctx.ellipse(hx, hy, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Biển gỗ chỉ số cắm đằng trước luống
    this.drawWoodenStakeSign(0, 72, count, isSelected);

    ctx.restore();
  }

  // Bố trí các củ cà rốt cắm trên luống sao cho trẻ dễ quan sát và đếm 1, 2, 3...
  drawCarrotsOnPatch(count, isHovered) {
    const positions = [];
    if (count <= 5) {
      // 1 hàng cong vòng cung
      const startX = -((count - 1) * 36) / 2;
      for (let i = 0; i < count; i++) {
        positions.push({
          x: startX + i * 36,
          y: 18 - Math.sin((i / (count - 1 || 1)) * Math.PI) * 8
        });
      }
    } else {
      // 2 hàng sole giúp dễ đếm rõ ràng
      const row1Count = Math.ceil(count / 2);
      const row2Count = Math.floor(count / 2);

      const startX1 = -((row1Count - 1) * 34) / 2;
      for (let i = 0; i < row1Count; i++) {
        positions.push({ x: startX1 + i * 34, y: 12 });
      }

      const startX2 = -((row2Count - 1) * 36) / 2;
      for (let i = 0; i < row2Count; i++) {
        positions.push({ x: startX2 + i * 36, y: 34 });
      }
    }

    positions.forEach((pos, idx) => {
      const hopOffset = isHovered ? Math.sin(this.time * 8 + idx) * 3 : 0;
      this.drawPlantedCarrot(pos.x, pos.y + hopOffset);
    });
  }

  // Vẽ 1 củ cà rốt đang cắm trong đất (thân củ nhú lên và chùm lá xanh tốt)
  drawPlantedCarrot(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Chùm lá xanh xum xuê đung đưa nhẹ
    const sway = Math.sin(this.time * 2 + x) * 0.08;
    ctx.rotate(sway);

    ctx.fillStyle = '#22C55E';
    // Lá giữa thẳng đứng
    ctx.beginPath();
    ctx.ellipse(0, -24, 4, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lá trái nghiêng
    ctx.beginPath();
    ctx.ellipse(-7, -20, 4, 13, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Lá phải nghiêng
    ctx.beginPath();
    ctx.ellipse(7, -20, 4, 13, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Phần củ cà rốt cam nhú khỏi đất
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.roundRect(-9, -10, 18, 14, [6, 6, 2, 2]);
    ctx.fill();

    // Vạch nếp củ cà rốt
    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6, -5);
    ctx.lineTo(2, -5);
    ctx.moveTo(-2, 0);
    ctx.lineTo(5, 0);
    ctx.stroke();

    // Đất tơi quấn quanh gốc củ
    ctx.fillStyle = '#451A03';
    ctx.beginPath();
    ctx.ellipse(0, 3, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Biển gỗ cắm trước luống đất hiển thị chữ số rõ ràng
  drawWoodenStakeSign(x, y, number, isSelected) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Cọc gỗ cắm xuống đất
    ctx.fillStyle = '#78350F';
    ctx.fillRect(-6, -15, 12, 35);

    // Tấm bảng gỗ chữ nhật bo góc
    ctx.fillStyle = isSelected ? '#FEF08A' : '#FDE68A';
    ctx.strokeStyle = isSelected ? '#EA580C' : '#92400E';
    ctx.lineWidth = isSelected ? 4 : 3;

    ctx.beginPath();
    ctx.roundRect(-42, -45, 84, 46, 12);
    ctx.fill();
    ctx.stroke();

    // Hai đinh ốc trang trí góc biển
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(-32, -37, 2.5, 0, Math.PI * 2);
    ctx.arc(32, -37, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Chữ số to, rõ ràng, màu đậm dễ đọc cho học sinh lớp 1
    ctx.fillStyle = isSelected ? '#C2410C' : '#78350F';
    ctx.font = '900 32px "Nunito", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), 0, -22);

    // Huy hiệu "Đã chọn" khi luống đang được click
    if (isSelected) {
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.arc(36, -42, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 14px "Nunito", sans-serif';
      ctx.fillText('✓', 36, -42);
    }

    ctx.restore();
  }

  // ---------------- VẼ CHÚ THỎ TRẮNG ĐÁNG YÊU (BUNNY) ----------------
  renderBunny(bunny) {
    const ctx = this.ctx;
    const { x, y, state, facingRight, hopCycle, carryingCarrot } = bunny;

    ctx.save();
    ctx.translate(x, y);

    // Lật hướng thỏ theo chiều chạy (Trái / Phải)
    if (!facingRight) {
      ctx.scale(-1, 1);
    }

    // Hiệu ứng bóng đổ mềm dính mặt đất
    const shadowScale = Math.max(0.4, 1 - (bunny.jumpY || 0) / 100);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 26, 32 * shadowScale, 10 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Biến hình theo bước nhảy (Squash & Stretch)
    ctx.translate(0, -(bunny.jumpY || 0));

    let bodyScaleX = 1;
    let bodyScaleY = 1;
    if (state === 'hopping') {
      bodyScaleX = 0.9 + Math.cos(hopCycle * 2) * 0.12;
      bodyScaleY = 1.1 - Math.cos(hopCycle * 2) * 0.12;
    } else if (state === 'digging') {
      bodyScaleX = 1.1;
      bodyScaleY = 0.85;
    }
    ctx.scale(bodyScaleX, bodyScaleY);

    const isCelebrating = state === 'cheer';
    const isConfused = state === 'scratch';

    // 1. Đuôi thỏ bông tròn xoe phía sau
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-26, 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Chân sau của thỏ
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.ellipse(-12, 22, 14, 8, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Thân thỏ trắng muốt tròn trịa
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 8, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Đầu thỏ
    ctx.beginPath();
    ctx.ellipse(8, -14, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 5. Hai tai thỏ dài xinh
    let earAngleL = -0.15;
    let earAngleR = 0.2;
    if (isConfused) {
      earAngleL = -0.4;
      earAngleR = 0.5; // Tai nghiêng thắc mắc
    } else if (isCelebrating) {
      earAngleL = -0.3;
      earAngleR = 0.3;
    }

    // Tai trái
    ctx.save();
    ctx.translate(2, -28);
    ctx.rotate(earAngleL);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, -18, 7, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Vành trong tai hồng
    ctx.fillStyle = '#FBCFE8';
    ctx.beginPath();
    ctx.ellipse(0, -18, 4, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Tai phải
    ctx.save();
    ctx.translate(14, -28);
    ctx.rotate(earAngleR);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, -18, 7, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Vành trong tai hồng
    ctx.fillStyle = '#FBCFE8';
    ctx.beginPath();
    ctx.ellipse(0, -18, 4, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Đôi mắt thỏ to tròn long lanh
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    if (isCelebrating) {
      // Mắt híp cười tít vui sướng ^_^
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#1E293B';
      ctx.arc(14, -16, 5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else {
      ctx.arc(14, -16, 4.5, 0, Math.PI * 2);
      ctx.fill();
      // Đốm sáng trong mắt
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(15.5, -17.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Má hồng baby
    ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
    ctx.beginPath();
    ctx.arc(10, -8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Mũi tam giác hồng xinh xắn
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.moveTo(18, -12);
    ctx.lineTo(22, -12);
    ctx.lineTo(20, -9);
    ctx.closePath();
    ctx.fill();

    // Miệng & Răng thỏ ngộ nghĩnh
    ctx.strokeStyle = '#71717A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(19, -7, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Chiếc răng thỏ trắng nhỏ
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(18.5, -7, 3.5, 3);
    ctx.strokeRect(18.5, -7, 3.5, 3);

    // 7. Tay thỏ ôm cà rốt hoặc cử động
    if (carryingCarrot) {
      // Ôm củ cà rốt to trước ngực tự hào
      this.drawMiniCarrot(22, 6, 1.25, 0.4);
      // Hai bàn tay ôm chặt
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(16, 8, 5, 0, Math.PI * 2);
      ctx.arc(26, 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (isCelebrating) {
      // Hai tay giơ cao vẫy chào
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.ellipse(8, -26, 5, 10, -0.4, 0, Math.PI * 2);
      ctx.ellipse(22, -26, 5, 10, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (isConfused) {
      // 1 tay gãi tai thắc mắc
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.ellipse(18, -32, 5, 9, 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Bong bóng suy nghĩ "?" nhỏ trên đầu
      ctx.fillStyle = '#EF4444';
      ctx.font = '900 24px "Nunito", sans-serif';
      ctx.fillText('?', 28, -48);
    } else {
      // Tay thỏ bình thường
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.ellipse(14, 10, 6, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Chân trước
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.ellipse(6, 24, 12, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // ---------------- HIỆU ỨNG PHÁO GIẤY & NGÔI SAO ĂN MỪNG (CONFETTI) ----------------
  renderParticles(particles) {
    const ctx = this.ctx;
    ctx.save();
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'star') {
        // Ngôi sao 5 cánh lấp lánh
        this.drawStarPath(ctx, 0, 0, 5, p.size, p.size * 0.45);
        ctx.fill();
      } else if (p.type === 'dirt') {
        // Hạt đất bay khi đào
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Pháo giấy chữ nhật màu sắc
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    });
    ctx.restore();
  }

  drawStarPath(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }
}
