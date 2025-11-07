/**
 * 음성 재생 유틸리티
 * Base64로 인코딩된 MP3 음성 데이터를 자동으로 재생합니다.
 */

/**
 * Base64 MP3 데이터를 자동 재생
 * @param {string} base64Audio - Base64로 인코딩된 MP3 데이터
 * @returns {Promise<Audio>} - Audio 객체 (재생 제어용)
 */
export const playAudioFromBase64 = (base64Audio) => {
  return new Promise((resolve, reject) => {
    if (!base64Audio) {
      console.warn('⚠️ 음성 데이터 없음 (텍스트만 표시)');
      reject(new Error('음성 데이터가 없습니다.'));
      return;
    }

    try {
      // Base64 → Blob 변환
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });

      // Blob → Audio URL 생성
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      // 재생 완료 시 메모리 정리
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        console.log('🔊 음성 재생 완료');
      };

      // 재생 에러 처리
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        console.error('❌ 음성 재생 실패:', error);
        reject(error);
      };

      // 자동 재생
      audio.play()
        .then(() => {
          console.log('🔊 음성 자동 재생 시작');
          resolve(audio);
        })
        .catch((err) => {
          URL.revokeObjectURL(audioUrl);
          console.error('❌ 음성 재생 실패:', err);
          reject(err);
        });
    } catch (error) {
      console.error('❌ 음성 처리 실패:', error);
      reject(error);
    }
  });
};

/**
 * 음성 재생 중지
 * @param {Audio} audio - 중지할 Audio 객체
 */
export const stopAudio = (audio) => {
  if (audio && !audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    console.log('⏹️ 음성 재생 중지');
  }
};

/**
 * 음성 일시정지
 * @param {Audio} audio - 일시정지할 Audio 객체
 */
export const pauseAudio = (audio) => {
  if (audio && !audio.paused) {
    audio.pause();
    console.log('⏸️ 음성 재생 일시정지');
  }
};

/**
 * 음성 재개
 * @param {Audio} audio - 재개할 Audio 객체
 */
export const resumeAudio = (audio) => {
  if (audio && audio.paused) {
    audio.play()
      .then(() => console.log('▶️ 음성 재생 재개'))
      .catch((err) => console.error('❌ 음성 재개 실패:', err));
  }
};
