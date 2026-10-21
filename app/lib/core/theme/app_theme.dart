import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  AppTheme._();

  // Color Palette
  static const Color primaryBlue = Color(0xFF4F46E5); // Enterprise Indigo (Target Web Match)
  static const Color secondaryTeal = Color(0xFFEA580C); // Enterprise Orange (Target Web Match)
  static const Color warningOrange = Color(0xFFF59E0B); // Amber Pending
  static const Color teacherPurple = Color(0xFF4C1D95); // Teacher Purple
  static const Color teacherPurpleDark = Color(0xFF7C3AED); // Teacher Purple Dark
  // Dashboard Color Palette
  static const Color dashGradientStart = Color(0xFF5B3FD8); // Primary Gradient Start
  static const Color dashGradientEnd = Color(0xFF7C4DFF); // Primary Gradient End
  static const Color secondaryPurple = Color(0xFF6C4CF5); // Secondary Purple
  static const Color accentLavender = Color(0xFFA78BFA); // Accent Lavender
  static const Color lightPurpleBg = Color(0xFFF4F1FF); // Light Purple Background
  static const Color cardWhite = Color(0xFFFFFFFF); // Card Background
  static const Color borderPurple = Color(0xFFE8E3FF); // Border
  static const Color primaryText = Color(0xFF1F1F2E); // Primary Text
  static const Color secondaryText = Color(0xFF6B7280); // Secondary Text
  static const Color success = Color(0xFF22C55E); // Success
  static const Color warning = Color(0xFFF59E0B); // Warning
  static const Color error = Color(0xFFEF4444); // Error
  static const Color info = Color(0xFF3B82F6); // Information
  static const Color errorRed = Color(0xFFEF4444); // Red Urgent/Delete

  // Dark Colors
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF1E293B);
  static const Color darkCard = Color(0xFF334155);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF94A3B8);

  // Light Colors
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightCard = Color(0xFFF1F5F9);
  static const Color lightTextPrimary = Color(0xFF0F172A); // Sharp Deep Slate/Black
  static const Color lightTextSecondary = Color(0xFF475569); // High Contrast Slate

  // Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: lightBackground,
      primaryColor: primaryBlue,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: secondaryTeal,
        surface: lightSurface,
        onSurface: lightTextPrimary,
        error: errorRed,
      ),
      iconTheme: const IconThemeData(color: lightTextPrimary),
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.light().textTheme.copyWith(
              displayLarge: const TextStyle(
                color: lightTextPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 30,
              ),
              titleLarge: const TextStyle(
                color: lightTextPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
              titleMedium: const TextStyle(
                color: lightTextPrimary,
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
              titleSmall: const TextStyle(
                color: lightTextPrimary,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
              bodyLarge: const TextStyle(
                color: lightTextPrimary,
                fontSize: 15,
              ),
              bodyMedium: const TextStyle(
                color: lightTextPrimary,
                fontSize: 13,
              ),
              bodySmall: const TextStyle(
                color: lightTextSecondary,
                fontSize: 12,
              ),
              labelLarge: const TextStyle(
                color: lightTextPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
      ),
      cardTheme: CardThemeData(
        color: lightSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.zero,
          side: const BorderSide(
            color: Color(0xFFCBD5E1),
            width: 1,
          ),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: lightSurface,
        elevation: 0,
        centerTitle: false,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
        ),
        iconTheme: IconThemeData(color: lightTextPrimary),
        titleTextStyle: TextStyle(
          color: lightTextPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          alignment: Alignment.center,
          minimumSize: const Size(64, 48),
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 14.5,
            height: 1.25,
            color: Colors.white,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryBlue,
          side: const BorderSide(color: primaryBlue, width: 1.5),
          alignment: Alignment.center,
          minimumSize: const Size(64, 48),
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            height: 1.25,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryBlue,
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 13,
            height: 1.25,
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: lightCard,
        selectedColor: primaryBlue,
        secondarySelectedColor: primaryBlue,
        labelStyle: const TextStyle(color: lightTextPrimary, fontSize: 13),
        secondaryLabelStyle: const TextStyle(color: Colors.white, fontSize: 13),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.zero,
          side: const BorderSide(color: Color(0xFFCBD5E1)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: lightSurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: const BorderSide(color: primaryBlue, width: 1.5),
        ),
        hintStyle: const TextStyle(color: lightTextSecondary, fontSize: 13),
        labelStyle: const TextStyle(color: lightTextPrimary, fontSize: 13),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: lightSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        titleTextStyle: const TextStyle(color: lightTextPrimary, fontSize: 18, fontWeight: FontWeight.bold),
        contentTextStyle: const TextStyle(color: lightTextSecondary, fontSize: 14),
      ),
    );
  }

  // Dark Theme
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      primaryColor: primaryBlue,
      colorScheme: const ColorScheme.dark(
        primary: primaryBlue,
        secondary: secondaryTeal,
        surface: darkSurface,
        onSurface: darkTextPrimary,
        error: errorRed,
      ),
      iconTheme: const IconThemeData(color: darkTextPrimary),
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme.copyWith(
              displayLarge: const TextStyle(
                color: darkTextPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 30,
              ),
              titleLarge: const TextStyle(
                color: darkTextPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
              titleMedium: const TextStyle(
                color: darkTextPrimary,
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
              titleSmall: const TextStyle(
                color: darkTextPrimary,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
              bodyLarge: const TextStyle(
                color: darkTextPrimary,
                fontSize: 15,
              ),
              bodyMedium: const TextStyle(
                color: darkTextSecondary,
                fontSize: 13,
              ),
              bodySmall: const TextStyle(
                color: darkTextSecondary,
                fontSize: 12,
              ),
              labelLarge: const TextStyle(
                color: darkTextPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
      ),
      cardTheme: CardThemeData(
        color: darkSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.zero,
          side: BorderSide(
            color: Colors.white.withValues(alpha: 0.08),
            width: 1,
          ),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: false,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
        ),
        iconTheme: IconThemeData(color: darkTextPrimary),
        titleTextStyle: TextStyle(
          color: darkTextPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          alignment: Alignment.center,
          minimumSize: const Size(64, 48),
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 14.5,
            height: 1.25,
            color: Colors.white,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: Colors.white,
          side: BorderSide(color: Colors.white.withValues(alpha: 0.3), width: 1.5),
          alignment: Alignment.center,
          minimumSize: const Size(64, 48),
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.zero,
          ),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            height: 1.25,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: const Color(0xFF60A5FA),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 13,
            height: 1.25,
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: darkSurface,
        selectedColor: primaryBlue,
        secondarySelectedColor: primaryBlue,
        labelStyle: const TextStyle(color: darkTextPrimary, fontSize: 13),
        secondaryLabelStyle: const TextStyle(color: Colors.white, fontSize: 13),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.zero,
          side: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkSurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.15)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: const BorderSide(color: primaryBlue, width: 1.5),
        ),
        hintStyle: const TextStyle(color: darkTextSecondary, fontSize: 13),
        labelStyle: const TextStyle(color: darkTextPrimary, fontSize: 13),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        titleTextStyle: const TextStyle(color: darkTextPrimary, fontSize: 18, fontWeight: FontWeight.bold),
        contentTextStyle: const TextStyle(color: darkTextSecondary, fontSize: 14),
      ),
    );
  }
}
