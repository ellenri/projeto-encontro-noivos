interface AdminCouple {
  name: string;
  numberOfCouples: number;
  assignedCouples?: string[];
}

export function performDraw(couples: string[], adminCouples: AdminCouple[]): AdminCouple[] {
  // Cria uma cópia dos arrays para não modificar os originais
  const availableCouples = [...couples];
  const result = adminCouples.map(admin => ({ ...admin }));
  
  // Embaralha o array de casais disponíveis
  for (let i = availableCouples.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCouples[i], availableCouples[j]] = [availableCouples[j], availableCouples[i]];
  }
  
  let currentIndex = 0;
  
  // Distribui os casais para cada casal mentor
  for (const admin of result) {
    admin.assignedCouples = [];
    for (let i = 0; i < admin.numberOfCouples && currentIndex < availableCouples.length; i++) {
      admin.assignedCouples.push(availableCouples[currentIndex]);
      currentIndex++;
    }
  }
  
  return result;
}
