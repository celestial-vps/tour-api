using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Repositories
{
    public class ColorRepository : IColorRepository
    {
        private readonly AppDbContext _context;

        public ColorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(Color? result, Exception? err)> SaveAsync(Color entity)
        {
            try
            {
                await _context.Colors.AddAsync(entity); // hanya tracking
                return (entity, null); // tidak save changes
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Save Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(Color? result, Exception? err)> UpdateAsync(Guid oid, Color updatedData)
        {
            try
            {
                var existing = await _context.Colors.FirstOrDefaultAsync(x => x.Oid == oid);
                if (existing == null)
                    return (null, new Exception("Color not found"));

                existing.ColorName = updatedData.ColorName;                

                return (existing, null); // hanya tracking
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Update Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(bool result, Exception? err)> RemoveAsync(Guid oid)
        {
            try
            {
                var color = await _context.Colors.FindAsync(oid);
                if (color == null)
                    return (false, new Exception("Color not found"));

                _context.Colors.Remove(color); // hanya tracking
                return (true, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] Remove Error: {ex}");
                return (false, ex);
            }
        }

        public async Task<(Color? result, Exception? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var color = await _context.Colors.FirstOrDefaultAsync(x => x.Oid == oid);
                return (color, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindById Error: {ex}");
                return (null, ex);
            }
        }

        public async Task<(List<Color> result, Exception? err)> FindAllAsync()
        {
            try
            {
                var colors = await _context.Colors.ToListAsync();
                return (colors, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAll Error: {ex}");
                return (new List<Color>(), ex);
            }
        }

        public async Task<(List<Color> result, Exception? err)> FindByCriteriaAsync(Func<Color, bool> predicate)
        {
            try
            {
                var filtered = _context.Colors.Where(predicate).ToList();
                return (filtered, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteria Error: {ex}");
                return (new List<Color>(), ex);
            }
        }

        public async Task<(List<Color> data, int count, Exception? err)> FindAndCountByCriteriaAsync(Func<Color, bool> predicate)
        {
            try
            {
                var filtered = _context.Colors.Where(predicate).ToList();
                return (filtered, filtered.Count, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindAndCountByCriteria Error: {ex}");
                return (new List<Color>(), 0, ex);
            }
        }

        public async Task<(List<Color> result, int count, Exception? err)> FindByCriteriaPageAsync(int page, int pageSize, ColorFilterDto condition)
        {

            try
            {
                // Bangun predicate filter
                var query = _context.Colors.AsQueryable();

                if (!string.IsNullOrWhiteSpace(condition.Name))
                {
                    query = query.Where(v => v.Name.Contains(condition.Name));
                }



                // Hitung total data sebelum pagination
                var totalCount = await query.CountAsync();

                // Terapkan pagination
                var filtered = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return (filtered, totalCount, null);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Repository] FindByCriteriaPageAsync Error: {ex}");
                return (new List<Color>(), 0, ex);
            }
        }
    }
 

} 
