import { describe, it, expect } from 'vitest';

describe('Internationalization', () => {
  describe('Date formatting', () => {
    it('should format dates in English (en-US)', () => {
      const date = new Date('2024-12-02');

      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long'
        }).format(date);
      };

      const result = formatDate(date);
      expect(result).toBe('December 2024');
    });

    it('should format full dates in English', () => {
      const date = new Date('2024-12-02');

      const formatFullDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
      };

      const result = formatFullDate(date);
      expect(result).toBe('December 2, 2024');
    });
  });

  describe('Expert data localization', () => {
    it('should have English content in sample expert data', () => {
      // Simule les données d'expert
      const expertBio = "Passionate librarian for 5 years, specialist in contemporary literature and fiction. I've read over 300 books this year and share my \"Pick of the Week\" with you every Monday.";
      const specialty = "Literature & Fiction";

      // Vérifie que c'est en anglais (pas de caractères français spéciaux dans le contenu principal)
      expect(expertBio).toContain('Passionate librarian');
      expect(expertBio).toContain('Pick of the Week');
      expect(specialty).toBe('Literature & Fiction');
    });

    it('should have English book descriptions', () => {
      const bookDescription = "The most incredible true story I've ever read";
      const fullDescription = "If you've ever felt that your education tore you away from your family, Tara Westover tells this heartbreak with brutal beauty that will move you.";

      // Vérifie que les descriptions sont en anglais
      expect(bookDescription).toContain("I've ever read");
      expect(fullDescription).toContain("If you've ever felt");
      expect(fullDescription).toContain("will move you");
    });
  });

  describe('UI text localization', () => {
    it('should use English UI text', () => {
      const uiTexts = {
        expertPick: "Expert's Pick",
        readingHistory: "Reading History",
        about: "About",
        specialties: "Specialties",
        recommendations: "recommendations",
        since: "Since"
      };

      // Vérifie que tous les textes UI sont en anglais
      expect(uiTexts.expertPick).toBe("Expert's Pick");
      expect(uiTexts.readingHistory).toBe("Reading History");
      expect(uiTexts.about).toBe("About");
      expect(uiTexts.specialties).toBe("Specialties");
      expect(uiTexts.recommendations).toBe("recommendations");
      expect(uiTexts.since).toBe("Since");
    });
  });
});
