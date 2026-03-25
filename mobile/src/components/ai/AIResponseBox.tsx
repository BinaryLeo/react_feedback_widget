import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'phosphor-react-native';
import type { AIAnalysis, Language } from '../../types';
import { t } from '../../i18n';
import { colors } from '../../theme/colors';
import { feedbackService } from '../../services/api';

interface AIResponseBoxProps {
  insight: AIAnalysis;
  lang: Language;
  feedbackId: string | null;
}

export function AIResponseBox({ insight, lang, feedbackId }: AIResponseBoxProps) {
  const [rating, setRating] = useState<'POSITIVE' | 'NEGATIVE' | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [ratingNote, setRatingNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!insight.suggestedResponse) return null;

  const handleCopy = () => {
    // Clipboard functionality would go here
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitRating = async (value: 'POSITIVE' | 'NEGATIVE', note?: string) => {
    if (!feedbackId) {
      setError('Feedback ID not available');
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await feedbackService.rateFeedback(feedbackId, value, note);
      
      if (result.success) {
        setRating(value);
        setShowNoteInput(false);
      } else {
        setError(result.error || 'Failed to save rating');
      }
    } catch (err) {
      setError('Failed to save rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbsUp = () => {
    if (rating) return;
    submitRating('POSITIVE');
  };

  const handleThumbsDown = () => {
    if (rating) return;
    setShowNoteInput(true);
  };

  const handleNoteSubmit = () => {
    submitRating('NEGATIVE', ratingNote.trim() || undefined);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('widget.ai_response', lang)}</Text>
        
        {/* Rating buttons */}
        <View style={styles.ratingContainer}>
          {!rating && feedbackId && (
            <>
              <TouchableOpacity
                onPress={handleThumbsUp}
                disabled={submitting}
                style={[styles.rateButton, styles.rateButtonPositive]}
              >
                <ThumbsUp size={14} color={colors.success} weight="bold" />
                <Text style={styles.rateButtonTextPositive}>{t('widget.helpful', lang) || 'Helpful'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleThumbsDown}
                disabled={submitting}
                style={[styles.rateButton, styles.rateButtonNegative]}
              >
                <ThumbsDown size={14} color={colors.gray[600]} weight="bold" />
                <Text style={styles.rateButtonTextNegative}>{t('widget.not_helpful', lang) || 'Not helpful'}</Text>
              </TouchableOpacity>
            </>
          )}
          {rating && (
            <View style={[styles.ratingBadge, rating === 'POSITIVE' ? styles.ratingPositive : styles.ratingNegative]}>
              <Text style={styles.ratingBadgeText}>
                {rating === 'POSITIVE' ? '✓ Helpful' : 'Noted'}
              </Text>
            </View>
          )}
          {!feedbackId && !rating && (
            <Text style={styles.rateAfterSubmitText}>Rate after submit</Text>
          )}
        </View>
      </View>

      {/* Response Content */}
      <View style={styles.content}>
        <Text style={styles.responseText}>{insight.suggestedResponse}</Text>
      </View>

      {/* Copy Button */}
      <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
        {copied ? (
          <>
            <Check size={16} color={colors.success} weight="bold" />
            <Text style={styles.copyButtonTextCopied}>Copied!</Text>
          </>
        ) : (
          <>
            <Copy size={16} color={colors.brand[600]} />
            <Text style={styles.copyButtonText}>Copy response</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Note Input for negative rating */}
      {showNoteInput && !rating && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>What could be improved?</Text>
          <TextInput
            value={ratingNote}
            onChangeText={setRatingNote}
            placeholder="Optional feedback..."
            maxLength={500}
            multiline
            numberOfLines={2}
            style={styles.noteInput}
          />
          <View style={styles.noteButtons}>
            <TouchableOpacity
              onPress={handleNoteSubmit}
              disabled={submitting}
              style={styles.noteSubmitButton}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.noteSubmitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowNoteInput(false)}
              style={styles.noteCancelButton}
            >
              <Text style={styles.noteCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brand[200],
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.brand[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.brand[200],
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand[700],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  rateButtonPositive: {
    backgroundColor: colors.success + '20',
  },
  rateButtonNegative: {
    backgroundColor: colors.gray[200],
  },
  rateButtonTextPositive: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },
  rateButtonTextNegative: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray[600],
  },
  ratingBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  ratingPositive: {
    backgroundColor: colors.success + '20',
  },
  ratingNegative: {
    backgroundColor: colors.gray[200],
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray[700],
  },
  rateAfterSubmitText: {
    fontSize: 11,
    color: colors.gray[400],
  },
  content: {
    padding: 12,
    backgroundColor: colors.white,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.brand[100],
  },
  responseText: {
    fontSize: 14,
    color: colors.gray[800],
    lineHeight: 20,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: colors.brand[50],
    borderTopWidth: 1,
    borderTopColor: colors.brand[100],
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.brand[600],
  },
  copyButtonTextCopied: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
    padding: 8,
  },
  noteContainer: {
    padding: 12,
    backgroundColor: colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: colors.gray[800],
    minHeight: 60,
    textAlignVertical: 'top',
  },
  noteButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  noteSubmitButton: {
    flex: 1,
    backgroundColor: colors.brand[500],
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  noteSubmitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  noteCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },
  noteCancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
  },
});
