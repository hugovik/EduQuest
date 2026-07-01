import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLearningPreference,
  updateLearningPreference,
} from "../../../api/learningPreferencesApi";
import { queryKeys } from "../../../api/queryKeys";

export function useLearningLevelPreference(adventureType) {
  const queryClient = useQueryClient();
  const preferenceQuery = useQuery({
    queryKey: queryKeys.learningPreference(adventureType),
    queryFn: () => getLearningPreference(adventureType),
  });

  const mutation = useMutation({
    mutationFn: (overrideLevel) => updateLearningPreference(
      adventureType,
      overrideLevel
    ),
    onMutate: async (overrideLevel) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.learningPreference(adventureType),
      });

      const previousPreference = queryClient.getQueryData(
        queryKeys.learningPreference(adventureType)
      );

      queryClient.setQueryData(
        queryKeys.learningPreference(adventureType),
        (currentPreference) => ({
          ...currentPreference,
          adventure_type: adventureType,
          override_level: overrideLevel,
        })
      );

      return { previousPreference };
    },
    onError: (_error, _overrideLevel, context) => {
      if (context?.previousPreference) {
        queryClient.setQueryData(
          queryKeys.learningPreference(adventureType),
          context.previousPreference
        );
      }
    },
    onSuccess: (preference) => {
      queryClient.setQueryData(
        queryKeys.learningPreference(adventureType),
        preference
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.learningPreferences });
    },
  });

  return {
    preference: preferenceQuery.data,
    overrideLevel: preferenceQuery.data?.override_level ?? null,
    setOverrideLevel: mutation.mutate,
    resetToChildGrade: () => mutation.mutate(null),
    isLoading: preferenceQuery.isLoading,
    isSaving: mutation.isPending,
    error: preferenceQuery.error ?? mutation.error,
  };
}
